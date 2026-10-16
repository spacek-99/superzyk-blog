import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../components/campfire-particles.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

function setup({ unavailable = false } = {}) {
  const frames = new Map();
  const observers = [];
  let nextId = 0;
  const context = {
    draws: 0,
    clears: 0,
    fillRect() { this.draws += 1; },
    clearRect() { this.clears += 1; },
    setTransform() {},
  };
  const canvas = {
    getContext: () => unavailable ? null : context,
    getBoundingClientRect: () => ({ width: 400, height: 400 }),
  };
  class ResizeObserver {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    window: { devicePixelRatio: 3 },
    Math: Object.assign(Object.create(Math), { random: () => 0.5 }),
    ResizeObserver,
    requestAnimationFrame: (callback) => { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  const particles = exports.createCampfireParticles(canvas);
  return {
    particles, frames, context, canvas, observers,
    frame(time) {
      const before = context.draws;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
      return context.draws - before;
    },
  };
}

test("pause stops all work and repeated start or resume keeps one animation loop", () => {
  const app = setup();
  assert.equal(app.frames.size, 0);
  assert.equal(app.context.draws, 0);
  for (let i = 0; i < 20; i += 1) app.particles.setRunning(true);
  assert.equal(app.frames.size, 1);
  assert.ok(app.frame(1000) > 0);
  assert.equal(app.frames.size, 1);

  const queued = [...app.frames.values()][0];
  app.particles.setRunning(false);
  app.particles.setRunning(false);
  const drawsWhenPaused = app.context.draws;
  queued(1040);
  app.particles.burst();
  app.particles.point(0.5, -0.5);
  assert.equal(app.frames.size, 0);
  assert.equal(app.context.draws, drawsWhenPaused);

  for (let i = 0; i < 20; i += 1) app.particles.setRunning(true);
  assert.equal(app.frames.size, 1);
  assert.ok(app.frame(10000) > 0);
  assert.equal(app.frames.size, 1);
  app.particles.destroy();
});

test("repeated bursts have a hard particle budget and expire without extra loops", () => {
  const app = setup();
  app.particles.setRunning(true);
  const baselineDraws = app.frame(1000);
  for (let i = 0; i < 100; i += 1) app.particles.burst();
  const burstDraws = app.frame(1040);
  assert.ok(burstDraws > baselineDraws, "interaction must create visible sparks");
  assert.ok(burstDraws <= baselineDraws + 32, "100 clicks must fit the 32-spark budget");
  assert.equal(app.frames.size, 1);

  let draws = burstDraws;
  for (let time = 1080; time <= 5000; time += 40) {
    draws = app.frame(time);
    assert.equal(app.frames.size, 1);
  }
  assert.ok(draws <= baselineDraws + 8, "only stars and their small twinkles should remain");
  app.particles.destroy();
});

test("destroy cancels pending frames, disconnects resize observation, and clears the canvas", () => {
  const app = setup();
  app.particles.setRunning(true);
  app.frame(1000);
  const queued = [...app.frames.values()][0];
  const draws = app.context.draws;
  const clears = app.context.clears;
  app.particles.destroy();
  queued(1040);
  assert.equal(app.frames.size, 0);
  assert.equal(app.context.draws, draws);
  assert.ok(app.context.clears > clears);
  assert.ok(app.observers.every((observer) => observer.disconnected));
});

test("unavailable Canvas rendering leaves controls usable without scheduling frames", () => {
  const app = setup({ unavailable: true });
  assert.doesNotThrow(() => {
    app.particles.setRunning(true);
    app.particles.burst();
    app.particles.point(0.5, -0.5);
    app.particles.setRunning(false);
    app.particles.setRunning(true);
    app.particles.destroy();
  });
  assert.equal(app.frames.size, 0);
  assert.equal(app.context.draws, 0);
  assert.ok(app.observers.every((observer) => observer.disconnected));
});
