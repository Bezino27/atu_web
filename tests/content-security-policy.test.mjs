import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";

const configSource = fs.readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(configSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

function loadConfig(environment) {
  const compiledModule = { exports: {} };
  new Function("module", "exports", "process", outputText)(
    compiledModule, compiledModule.exports, { env: { NODE_ENV: environment } },
  );
  return compiledModule.exports.default;
}

test("production CSP allows only self and the OpenFreeMap origin for connections", async () => {
  const rules = await loadConfig("production").headers();
  const rule = rules.find((entry) => entry.source === "/:path*");
  const policies = rule.headers.filter((header) => header.key === "Content-Security-Policy");
  assert.equal(policies.length, 1);
  const directives = new Map(policies[0].value.split(";").map((directive) => {
    const [name, ...sources] = directive.trim().split(/\s+/);
    return [name, sources];
  }));
  assert.deepEqual(directives.get("connect-src"), ["'self'", "https://tiles.openfreemap.org"]);
  assert.deepEqual(directives.get("worker-src"), ["'self'", "blob:"]);
  // Map glyph PBFs are fetched, not web fonts. Do not introduce broad font,
  // image, script or frame exceptions or override other policy directives.
  assert.deepEqual([...directives.keys()].sort(), ["connect-src", "worker-src"]);
  assert.doesNotMatch(policies[0].value, /\*|unsafe-|stadiamaps|http:/);
});

test("development CSP leaves HMR and the local backend unaffected", async () => {
  assert.deepEqual(await loadConfig("development").headers(), []);
});

test("same-origin backend API rewrites remain available under the production CSP", async () => {
  const rules = await loadConfig("production").rewrites();
  assert.deepEqual(rules.map((rule) => rule.source), ["/backend-api/:path*/", "/backend-api/:path*"]);
});
