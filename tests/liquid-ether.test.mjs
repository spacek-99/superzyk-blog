import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../components/LiquidEther.jsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function setup({ unavailable = false, compileFailure = false, linkFailure = false } = {}) {
  const events = () => {
    const handlers = new Map();
    return {
      handlers,
      addEventListener: (name, handler) => handlers.set(name, handler),
      removeEventListener: (name) => handlers.delete(name),
      emit: (name, data = {}) => handlers.get(name)?.(data),
    };
  };
  const live = { shader: new Set(), program: new Set(), buffer: new Set(), vertexArray: new Set() };
  const created = { program: 0 };
  const uniforms = new Map();
  const gl = { compileFailure, linkFailure, drawFailure: false, draws: 0 };
  for (const name of ["VERTEX_SHADER", "FRAGMENT_SHADER", "COMPILE_STATUS", "LINK_STATUS", "ARRAY_BUFFER", "STATIC_DRAW", "FLOAT", "DEPTH_TEST", "BLEND", "FUNC_ADD", "SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "ONE", "COLOR_BUFFER_BIT", "TRIANGLES", "NO_ERROR"]) gl[name] = name;
  for (const [kind, suffix] of [["shader", "Shader"], ["program", "Program"], ["buffer", "Buffer"], ["vertexArray", "VertexArray"]]) {
    gl[`create${suffix}`] = () => {
      const object = {};
      live[kind].add(object);
      if (kind === "program") created.program += 1;
      return object;
    };
    gl[`delete${suffix}`] = (object) => live[kind].delete(object);
  }
  for (const method of ["shaderSource", "compileShader", "attachShader", "detachShader", "bindAttribLocation", "linkProgram", "bindVertexArray", "bindBuffer", "bufferData", "enableVertexAttribArray", "vertexAttribPointer", "useProgram", "clearColor", "disable", "enable", "blendEquation", "blendFuncSeparate", "clear"]) gl[method] = () => {};
  gl.getShaderParameter = () => !gl.compileFailure;
  gl.getProgramParameter = () => !gl.linkFailure;
  gl.isProgram = (program) => live.program.has(program);
  gl.getUniformLocation = (_program, name) => name;
  gl.uniform1f = (name, value) => uniforms.set(name, value);
  gl.uniform2f = (name, x, y) => uniforms.set(name, [x, y]);
  gl.uniform3fv = (name, values) => uniforms.set(name, Array.from(values));
  gl.viewport = (...values) => { gl.size = values; };
  gl.getError = () => gl.NO_ERROR;
  gl.drawArrays = () => {
    if (gl.drawFailure) throw new Error("draw failure");
    gl.draws += 1;
  };

  const canvas = { ...events(), style: {}, getContext: () => unavailable ? null : gl, remove: () => { canvas.removed = true; } };
  const container = { clientWidth: 800, clientHeight: 400, appendChild: () => {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 400 }) };
  const fallback = { hidden: false };
  const frames = new Map();
  let nextId = 0;
  let now = 0;
  const observers = [];
  const resizeObservers = [];
  const win = {
    ...events(), devicePixelRatio: 3,
    requestAnimationFrame: (callback) => { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  const doc = { ...events(), visibilityState: "visible", createElement: () => canvas };
  class IntersectionObserver {
    constructor(callback) { observers.push(this); this.callback = callback; }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  class ResizeObserver {
    constructor(callback) { resizeObservers.push(this); this.callback = callback; }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  win.IntersectionObserver = IntersectionObserver;
  const refs = [container, fallback];
  const effects = [];
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window: win, document: doc, IntersectionObserver, ResizeObserver,
    performance: { now: () => now },
    require: (name) => {
      if (name === "react") return { useRef: (value) => ({ current: refs.length ? refs.shift() : value }), useEffect: (effect) => effects.push(effect) };
      if (name === "react/jsx-runtime") return { jsx: () => null };
      if (name === "./LiquidEther.css") return {};
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  exports.default({ resolution: 0.55 });
  const cleanup = effects[0]();
  return {
    gl, live, uniforms, created, canvas, container, fallback, frames, win, doc,
    get observer() { return observers[0]; },
    get resizeObserver() { return resizeObservers[0]; },
    cleanup,
    view: (visible) => observers[0].callback([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]),
    frame: (time) => {
      now = time;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
    },
    lose: () => {
      Object.values(live).forEach((objects) => objects.clear());
      let prevented = false;
      canvas.emit("webglcontextlost", { preventDefault: () => { prevented = true; } });
      assert.equal(prevented, true);
    },
  };
}

test("WebGL unavailable or failed shader setup leaves a static fallback without leaked resources", () => {
  for (const options of [{ unavailable: true }, { compileFailure: true }, { linkFailure: true }]) {
    const app = setup(options);
    assert.equal(app.fallback.hidden, false);
    assert.equal(app.frames.size, 0);
    assert.equal(app.cleanup, undefined);
    for (const objects of Object.values(app.live)) assert.equal(objects.size, 0);
  }
});

test("offscreen and hidden states pause elapsed time and repeated resume signals schedule one frame", () => {
  const app = setup();
  assert.equal(app.frames.size, 0);
  app.view(true);
  app.view(true);
  assert.equal(app.frames.size, 1);
  app.frame(1000);
  app.frame(1500);
  assert.equal(app.uniforms.get("uTime"), 0.5);
  assert.equal(app.fallback.hidden, true);
  app.view(false);
  assert.equal(app.frames.size, 0);
  app.view(true);
  app.frame(10000);
  assert.equal(app.uniforms.get("uTime"), 0.5);
  app.doc.visibilityState = "hidden";
  app.doc.emit("visibilitychange");
  assert.equal(app.frames.size, 0);
  app.doc.visibilityState = "visible";
  app.doc.emit("visibilitychange");
  app.doc.emit("visibilitychange");
  assert.equal(app.frames.size, 1);
  app.frame(20000);
  assert.equal(app.uniforms.get("uTime"), 0.5);
  app.cleanup();
});

test("context restoration rebuilds invalid GPU objects and resumes exactly one loop", () => {
  const app = setup();
  app.view(true);
  app.frame(1000);
  app.lose();
  assert.equal(app.frames.size, 0);
  assert.equal(app.fallback.hidden, false);
  assert.equal(app.canvas.style.visibility, "hidden");
  app.canvas.emit("webglcontextrestored");
  assert.equal(app.created.program, 2);
  assert.equal(app.live.program.size, 1);
  assert.equal(app.live.buffer.size, 1);
  assert.equal(app.frames.size, 1);
  app.frame(2000);
  assert.equal(app.fallback.hidden, true);
  assert.equal(app.canvas.style.visibility, "visible");
  app.cleanup();
  assert.equal(app.frames.size, 0);
  for (const objects of Object.values(app.live)) assert.equal(objects.size, 0);
  assert.equal(app.observer.disconnected, true);
  assert.equal(app.resizeObserver.disconnected, true);
  assert.equal(app.win.handlers.size, 0);
  assert.equal(app.doc.handlers.size, 0);
  assert.equal(app.canvas.handlers.size, 0);
  assert.equal(app.canvas.removed, true);
});

test("failed restoration and draw failures keep the fallback and stop scheduling", () => {
  const app = setup();
  app.view(true);
  app.frame(1000);
  app.lose();
  app.gl.compileFailure = true;
  app.canvas.emit("webglcontextrestored");
  assert.equal(app.frames.size, 0);
  assert.equal(app.fallback.hidden, false);
  for (const objects of Object.values(app.live)) assert.equal(objects.size, 0);
  app.cleanup();

  const drawing = setup();
  drawing.gl.drawFailure = true;
  drawing.view(true);
  drawing.frame(1000);
  assert.equal(drawing.frames.size, 0);
  assert.equal(drawing.fallback.hidden, false);
  drawing.cleanup();
});

test("DPR is capped, resize updates the drawing buffer, and pointer coordinates retain vertical orientation", () => {
  const app = setup();
  assert.equal(app.canvas.width, 880);
  assert.equal(app.canvas.height, 440);
  app.container.clientWidth = 640;
  app.resizeObserver.callback();
  assert.equal(app.canvas.width, 704);
  app.view(true);
  app.win.emit("pointermove", { clientX: 600, clientY: 100 });
  app.frame(1000);
  const mouse = app.uniforms.get("uMouse");
  assert.ok(mouse[0] > 0.5 && mouse[1] > 0.5);
  assert.ok(app.uniforms.get("uMouseForce") > 0);
  app.cleanup();
});
