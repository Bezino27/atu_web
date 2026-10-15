import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";

const componentPath = new URL("../src/app/components/OpenFreeMapLayer.tsx", import.meta.url);
const source = fs.readFileSync(componentPath, "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
});

function harness({ importError } = {}) {
  let effect;
  let options;
  let imports = 0;
  let added = 0;
  let removed = 0;
  const states = [];
  const events = new Map();
  const map = {};
  const renderer = {
    on: (name, callback) => events.set(name, callback),
    off: (name, callback) => {
      assert.equal(events.get(name), callback);
      events.delete(name);
    },
  };
  const layer = {
    addTo: (target) => { assert.equal(target, map); added += 1; return layer; },
    getMaplibreMap: () => renderer,
    remove: () => { removed += 1; },
  };
  const dependencies = {
    react: {
      useEffect: (callback) => { effect = callback; },
      useState: () => [false, (value) => states.push(value)],
    },
    "react/jsx-runtime": jsxRuntime,
    "react-leaflet": { useMap: () => map },
  };
  function resolve(name) {
    if (name.endsWith(".css")) return {};
    if (name === "@maplibre/maplibre-gl-leaflet") {
      imports += 1;
      if (importError) throw importError;
      return { maplibreGL: (value) => { options = value; return layer; } };
    }
    assert.ok(name in dependencies, `Unexpected eager browser dependency: ${name}`);
    return dependencies[name];
  }
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", "console", outputText)(
    resolve, compiledModule, compiledModule.exports, { error() {} },
  );
  compiledModule.exports.default();
  return {
    mount: () => effect(), states, events,
    get options() { return options; },
    get imports() { return imports; },
    get added() { return added; },
    get removed() { return removed; },
  };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test("OpenFreeMap initializes after mount, keeps Leaflet controls and removes its layer", async () => {
  const view = harness();
  assert.equal(view.imports, 0);
  const cleanup = view.mount();
  await flush();
  assert.equal(view.imports, 1);
  assert.equal(view.added, 1);
  assert.equal(view.options.style, "https://tiles.openfreemap.org/styles/positron");
  assert.equal(view.options.interactive, false);
  for (const credit of ["OpenFreeMap", "OpenMapTiles", "OpenStreetMap"]) {
    assert.ok(view.options.attributionControl.customAttribution.includes(credit));
  }
  view.events.get("error")({ error: new Error("Tile request failed") });
  view.events.get("idle")();
  assert.deepEqual(view.states, [true, false]);
  cleanup();
  assert.equal(view.removed, 1);
  assert.equal(view.events.size, 0);
});

test("late adapter imports cannot create layers after unmount or a Strict Mode replay", async () => {
  const view = harness();
  view.mount()();
  await flush();
  assert.equal(view.added, 0);
  assert.equal(view.removed, 0);
  assert.deepEqual(view.states, []);
  const cleanup = view.mount();
  await flush();
  assert.equal(view.added, 1);
  cleanup();
  assert.equal(view.removed, 1);
});

test("adapter initialization failure shows the map error state without an unhandled rejection", async () => {
  const view = harness({ importError: new Error("Chunk failed") });
  const cleanup = view.mount();
  await flush();
  assert.deepEqual(view.states, [true]);
  assert.equal(view.added, 0);
  cleanup();
});
