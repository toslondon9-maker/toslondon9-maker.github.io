import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteData } from "../content/site-data.mjs";
import { renderPage } from "../src/page-shell.mjs";
import { routeRenderers } from "../src/routes.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewRoot = path.join(repositoryRoot, ".build-preview");

function outputPathForRoute(route) {
  return route === "/" ? "index.html" : `${route.slice(1)}index.html`;
}

async function writeBuild(outputRoot) {
  const files = [];
  const hash = createHash("sha256");

  for (const route of Object.values(siteData.routes)) {
    const render = routeRenderers[route];
    if (!render) throw new Error(`No renderer is registered for ${route}`);

    const relativeFile = outputPathForRoute(route);
    const outputFile = path.join(outputRoot, relativeFile);
    const html = renderPage(render(siteData));
    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, html, "utf8");
    files.push(relativeFile);
  }

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
  else console.log(`Built ${result.files.length} static pages`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
