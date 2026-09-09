import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { readStoredTheme, saveTheme } from "../lib/theme.ts";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

function browser(storage) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
}

afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", originalWindow);
  } else {
    delete globalThis.window;
  }
});

test("a saved theme can be restored and a new preference persists", () => {
  const values = new Map([["superzyk-theme", "light"]]);
  browser({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  });
  assert.equal(readStoredTheme(), "light");
  saveTheme("dark");
  assert.equal(readStoredTheme(), "dark");
  saveTheme("light");
  assert.equal(values.get("superzyk-theme"), "light");
});

test("missing or unrecognized preferences preserve the default dark theme", () => {
  for (const value of [null, "", "system", "LIGHT"]) {
    browser({ getItem: () => value });
    assert.equal(readStoredTheme(), "dark");
  }
});

test("a denied storage read falls back without preventing later saves", () => {
  const saved = [];
  browser({
    getItem: () => { throw new DOMException("Denied", "SecurityError"); },
    setItem: (key, value) => saved.push([key, value]),
  });
  assert.equal(readStoredTheme(), "dark");
  saveTheme("light");
  assert.deepEqual(saved, [["superzyk-theme", "light"]]);
});

test("a denied storage write does not throw or discard a readable preference", () => {
  browser({
    getItem: () => "light",
    setItem: () => { throw new DOMException("Full", "QuotaExceededError"); },
  });
  assert.equal(readStoredTheme(), "light");
  assert.doesNotThrow(() => saveTheme("dark"));
  assert.equal(readStoredTheme(), "light");
});

test("blocking the localStorage property itself leaves theme functions usable", () => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      get localStorage() { throw new DOMException("Denied", "SecurityError"); },
    },
  });
  assert.equal(readStoredTheme(), "dark");
  assert.doesNotThrow(() => saveTheme("light"));
});
