import { createHash } from "node:crypto";
import { copyFile, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteData } from "../content/site-data.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { routeRenderers } from "../src/routes.mjs";
import { renderSitemap } from "../src/sitemap.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewRoot = path.join(repositoryRoot, ".build-preview");
const runtimeFiles = Object.freeze([
  "assets/index-Bgwsdhov.css",
  "assets/curriculum.mjs",
  "assets/ai-mentors.mjs",
  "assets/platform.css",
  "assets/seven-day-progress.mjs",
  "assets/site-language.mjs",
  "assets/site-navigation.mjs",
  "assets/tabs.mjs",
  "content/translations.mjs",
]);
const siteMetadataFiles = Object.freeze(["robots.txt"]);
const buildRoutes = Object.freeze([...Object.values(siteData.routes), ...siteData.experienceRoutes]);

function outputPathForRoute(route) {
  return route === "/" ? "index.html" : `${route.slice(1)}index.html`;
}

async function collectFiles(directory, relativeDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const source = path.join(directory, entry.name);
    const relativeFile = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(source, relativeFile));
    else if (entry.isFile()) files.push(relativeFile);
  }

  return files;
}

async function copyBuildDependencies(outputRoot) {
  const files = [
    ...runtimeFiles,
    ...await collectFiles(path.join(repositoryRoot, "images"), "images"),
    ...await collectFiles(path.join(repositoryRoot, "downloads"), "downloads"),
  ];

  for (const relativeFile of files) {
    const source = path.join(repositoryRoot, ...relativeFile.split("/"));
    const destination = path.join(outputRoot, ...relativeFile.split("/"));
    if (path.resolve(source) === path.resolve(destination)) continue;
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }

  return files;
}

async function copySiteMetadata(outputRoot) {
  for (const relativeFile of siteMetadataFiles) {
    const source = path.join(repositoryRoot, relativeFile);
    const destination = path.join(outputRoot, relativeFile);
    if (path.resolve(source) === path.resolve(destination)) continue;
    await copyFile(source, destination);
  }

  return siteMetadataFiles;
}

async function cleanPreviewOutput() {
  await mkdir(previewRoot, { recursive: true });
  for (const entry of await readdir(previewRoot)) {
    if (entry === ".gitkeep") continue;
    const target = path.resolve(previewRoot, entry);
    if (path.dirname(target) !== previewRoot) throw new Error("Refusing to clean outside the preview directory");
    await rm(target, { recursive: true, force: true });
  }
}

async function writeBuild(outputRoot) {
  const files = [];
  const hash = createHash("sha256");

  for (const route of buildRoutes) {
    const render = routeRenderers[route];
    if (!render) throw new Error(`No renderer is registered for ${route}`);

    const relativeFile = outputPathForRoute(route);
    const outputFile = path.join(outputRoot, relativeFile);
    const html = renderPage(render(siteData));
    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, html, "utf8");
    files.push(relativeFile);
  }

  const sitemapFile = "sitemap.xml";
  await writeFile(path.join(outputRoot, sitemapFile), renderSitemap(siteData), "utf8");
  files.push(sitemapFile);
  files.push(...await copyBuildDependencies(outputRoot));
  files.push(...await copySiteMetadata(outputRoot));

  for (const relativeFile of files) {
    hash.update(relativeFile);
    hash.update("\0");
    hash.update(await readFile(path.join(outputRoot, relativeFile)));
    hash.update("\0");
  }

  return { files, hash: hash.digest("hex") };
}

async function verifyDeterminism() {
  const firstRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-build-check-"));
  const secondRoot = await mkdtemp(path.join(os.tmpdir(), "unleash-build-check-"));

  try {
    const [first, second] = await Promise.all([writeBuild(firstRoot), writeBuild(secondRoot)]);
    if (JSON.stringify(first.files) !== JSON.stringify(second.files) || first.hash !== second.hash) {
      throw new Error("Static build is not deterministic");
    }
    return first;
  } finally {
    await Promise.all([
      rm(firstRoot, { recursive: true, force: true }),
      rm(secondRoot, { recursive: true, force: true }),
    ]);
  }
}

export async function buildSite({ outputRoot, check = false } = {}) {
  const checkedBuild = check ? await verifyDeterminism() : null;
  if (outputRoot === undefined && check) return { files: checkedBuild.files };

  if (outputRoot === undefined) await cleanPreviewOutput();
  const build = await writeBuild(outputRoot ?? previewRoot);
  return { files: build.files };
}

async function main() {
  const arguments_ = new Set(process.argv.slice(2));
  const allowedArguments = new Set(["--check", "--write-public"]);
  const unknown = [...arguments_].filter((argument) => !allowedArguments.has(argument));
  if (unknown.length > 0) throw new Error(`Unknown argument: ${unknown.join(", ")}`);

  const check = arguments_.has("--check");
  const outputRoot = arguments_.has("--write-public") ? repositoryRoot : undefined;
  const result = await buildSite({ outputRoot, check });
  if (check) console.log("Build is deterministic");
  else console.log(`Built ${result.files.filter((file) => file.endsWith("index.html")).length} static pages`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
