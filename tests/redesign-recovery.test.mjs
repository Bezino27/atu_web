import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Exercise the actual TypeScript modules without adding a test runner dependency.
const root = fileURLToPath(new URL("../", import.meta.url));
const requireDependency = createRequire(import.meta.url);
const modules = new Map();
function load(relativePath) {
  let filename = path.resolve(root, relativePath);
  if (filename.endsWith(".css")) {
    return { __esModule: true, default: new Proxy({}, { get: (_, name) => name }) };
  }
  if (!path.extname(filename)) {
    filename += fs.existsSync(`${filename}.ts`) ? ".ts" : ".tsx";
  }
  if (modules.has(filename)) return modules.get(filename).exports;
  const compiledModule = { exports: {} };
  modules.set(filename, compiledModule);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  function resolve(name) {
    if (name.startsWith("@/")) return load(`src/${name.slice(2)}`);
    if (name.startsWith(".")) return load(path.resolve(path.dirname(filename), name));
    return requireDependency(name);
  }
  new Function("require", "module", "exports", outputText)(resolve, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

test("rich HTML removes executable content while retaining article formatting", () => {
  const { prepareBackendRichHtml } = load("src/app/lib/richHtml.ts");
  const result = prepareBackendRichHtml(
    '<p><strong>ATU</strong><script>alert(1)</script>' +
    '<img src="/media/photo.jpg" onerror="alert(2)">' +
    '<a href="javascript:alert(3)" target="_blank">link</a></p>' +
    '<table><tr><td colspan="2">7:6</td></tr></table>',
  );
  assert.doesNotMatch(result, /script|onerror|javascript:/);
  assert.match(result, /<strong>ATU<\/strong>/);
  assert.match(result, /colspan="2"/);
  assert.match(result, /noopener noreferrer/);
  assert.match(result, /\/media\/photo.jpg/);
  assert.equal(prepareBackendRichHtml(null), "");
  const links = prepareBackendRichHtml(
    '<a href="/clanky/test">článok</a><a href="#sekcia">sekcia</a>' +
    '<a href="mailto:info@example.com">email</a><a href="tel:+421900000000">telefón</a>',
  );
  for (const href of ["/clanky/test", "#sekcia", "mailto:info@example.com", "tel:+421900000000"]) {
    assert.ok(links.includes(`href="${href}"`));
  }
});

test("article lists support pagination, legacy arrays and cyclic next links", async (t) => {
  const { getAllPosts, filterPostsByCategory } = load("src/app/lib/posts.ts");
  const urls = [];
  t.mock.method(global, "fetch", async (url) => {
    urls.push(url);
    return { ok: true, json: async () => urls.length === 1
      ? { results: [{ id: 1 }], next: "?page=2" }
      : { results: [{ id: 2 }], next: null } };
  });
  assert.deepEqual((await getAllPosts("atu-kosice")).map((post) => post.id), [1, 2]);
  assert.equal(urls.length, 2);
  assert.equal(new URL(urls[1]).searchParams.get("page"), "2");

  t.mock.method(global, "fetch", async () => ({ ok: true, json: async () => [{ id: 3 }] }));
  assert.deepEqual(await getAllPosts("atu-kosice"), [{ id: 3 }]);

  let count = 0;
  t.mock.method(console, "error", () => {});
  t.mock.method(global, "fetch", async (url) => {
    count += 1;
    return { ok: true, json: async () => ({ results: [{ id: 4 }], next: url }) };
  });
  assert.deepEqual(await getAllPosts("atu-kosice"), [{ id: 4 }]);
  assert.equal(count, 1);
  assert.equal(filterPostsByCategory([
    { category: { slug: "muzi", name: "Muži" } },
    { category: { slug: "mladez", name: "Mládež" } },
  ], "juniori").length, 1);
});

test("team logo lookup never returns a missing local asset", () => {
  const { getTeamLogo } = load("src/app/lib/teamLogos.ts");
  assert.equal(getTeamLogo("FaBK ATU Košice"), "/logo/znak_atu_nove.svg");
  assert.equal(getTeamLogo("DTF team Detva Joxers"), null);
  assert.equal(getTeamLogo("Neznámy tím"), null);
  assert.ok(fs.existsSync(path.join(root, "public", getTeamLogo("ATU Košice"))));
});

test("article images render an accessible fallback and retain legacy images", () => {
  const ArticleImage = load("src/app/components/ArticleImage.tsx").default;
  const render = (post) => renderToStaticMarkup(React.createElement(ArticleImage, {
    post, alt: "Článok ATU", sizes: "400px",
  }));
  const fallback = render({ featured_image: null });
  assert.match(fallback, /aria-label="Článok ATU"/);
  assert.match(fallback, /znak_atu_white\.svg/);
  assert.doesNotMatch(fallback, /news1\.jpg/);
  const legacy = render({ featured_image: "/images/news1.jpg" });
  assert.match(legacy, /src="\/images\/news1\.jpg"/);
  const optimized = render({
    featured_image: "/images/news1.jpg", image_width: 800, image_height: 600,
  });
  assert.match(optimized, /width="800"/);
  assert.match(optimized, /height="600"/);
  assert.match(optimized, /srcSet=/);
});

test("long player names use responsive size classes and preserve every name part", () => {
  const Name = load("src/app/kategorie/components/CategoryLeaderPlayerName.tsx").default;
  const result = renderToStaticMarkup(React.createElement(Name, { name: "  Ján   DlhéPriezvisko Novák  " }));
  assert.match(result, /playerNameLong/);
  assert.match(result, />Ján<\/span>/);
  assert.match(result, />DlhéPriezvisko Novák<\/span>/);
});
