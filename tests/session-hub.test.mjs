import test from "node:test";
import assert from "node:assert/strict";
import { siteData } from "../content/site-data.mjs";
import { sessionHubPage } from "../src/pages/session-hub.mjs";
test("Session Hub includes dashboard, stages and local reflection room", () => { const page = sessionHubPage(siteData); for (const text of ["YOUR JOURNEY", "Week 1 of 24", "Foundation", "Visualisation", "Concentration", "Contemplation", "One Consciousness", "Reflection Room", "data-session-reflection-input", "assets/session-hub.mjs"]) assert.match(page.body + page.scripts.join(""), new RegExp(text)); });
