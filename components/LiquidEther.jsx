"use client";

import { useEffect, useRef } from "react";
import "./LiquidEther.css";

const vertexShader = `#version 300 es
  in vec2 aPosition;
  out vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShader = `#version 300 es
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  uniform float uCursorSize;
  uniform vec2 uMouseDelta;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  in vec2 vUv;
  out vec4 outColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.52;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse;
    float dist = distance(uv, mouse);
    float influence = smoothstep(uCursorSize, 0.0, dist);
    float force = influence * uMouseForce * 0.022;
    vec2 direction = normalize(uMouseDelta + vec2(0.001, -0.001));

    vec2 flow = vec2(
      fbm(uv * 2.8 + vec2(uTime * 0.08, force * 0.9) + direction * 0.16),
      fbm(uv * 2.8 - vec2(force * 0.72, uTime * 0.07) - direction.yx * 0.14)
    );
    vec2 warped = uv + (flow - 0.5) * 0.34 + direction * force + normalize(uv - mouse + 0.001) * force * 0.28;

    float bands = fbm(warped * 3.4 + uTime * 0.07);
    float ribbons = sin((warped.x + warped.y * 0.75 + bands * 0.95) * 10.0 + uTime * 0.62) * 0.5 + 0.5;
    vec3 color = mix(uColorA, uColorB, smoothstep(0.15, 0.88, bands));
    color = mix(color, uColorC, smoothstep(0.28, 0.88, ribbons) * 0.78);

    float alpha = 0.5 + 0.38 * smoothstep(0.12, 1.0, bands);
    alpha *= smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x);
    alpha *= smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.9, uv.y);

    outColor = vec4(color, alpha);
  }
`;

// Match the previous renderer's linear color uniforms. This custom shader never
// applied an output color-space transform, so adding one would change its palette.
function hexToLinear(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [16, 8, 0].map((shift) => {
    const channel = ((value >> shift) & 255) / 255;
    return channel < 0.04045
      ? channel * 0.0773993808
      : Math.pow(channel * 0.9478672986 + 0.0521327014, 2.4);
  });
}

function createResources(gl, colors, cursorSize) {
  const shaders = [];
  let program;
  let buffer;
  let vertexArray;

  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertexShader],
      [gl.FRAGMENT_SHADER, fragmentShader],
    ]) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("WebGL shader unavailable");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("WebGL shader compilation failed");
      }
    }

    program = gl.createProgram();
    if (!program) throw new Error("WebGL program unavailable");
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("WebGL program linking failed");
    }

    buffer = gl.createBuffer();
    vertexArray = gl.createVertexArray();
    if (!buffer || !vertexArray) throw new Error("WebGL geometry unavailable");
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // The same two triangles and UV orientation as the original 2 x 2 plane.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, 1, -1, -1, 1, 1,
      -1, -1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const uniforms = Object.fromEntries([
      "uTime", "uMouse", "uMouseDelta", "uMouseForce", "uCursorSize",
      "uColorA", "uColorB", "uColorC",
    ].map((name) => [name, gl.getUniformLocation(program, name)]));
    gl.uniform1f(uniforms.uCursorSize, cursorSize / 1000);
    ["uColorA", "uColorB", "uColorC"].forEach((name, index) => {
      gl.uniform3fv(uniforms[name], hexToLinear(colors[index] ?? defaultColors[index]));
    });
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    // Store premultiplied pixels, matching the canvas compositor and the previous
    // transparent material's normal blending. Otherwise soft edges turn dark.
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    return { program, buffer, vertexArray, uniforms };
  } catch (error) {
    if (buffer) gl.deleteBuffer(buffer);
    if (vertexArray) gl.deleteVertexArray(vertexArray);
    if (program) gl.deleteProgram(program);
    throw error;
  } finally {
    shaders.forEach((shader) => {
      if (program && gl.isProgram(program)) gl.detachShader(program, shader);
      gl.deleteShader(shader);
    });
  }
}

function disposeResources(gl, resources) {
  if (!resources) return;
  gl.deleteBuffer(resources.buffer);
  gl.deleteVertexArray(resources.vertexArray);
  gl.deleteProgram(resources.program);
}

const defaultColors = ["#8b5cf6", "#c084fc", "#93c5fd"];

export default function LiquidEther({
  colors = defaultColors,
  fallback = null,
  mouseForce = 12,
  cursorSize = 90,
  resolution = 0.35,
  autoDemo = true,
  autoSpeed = 0.35,
  autoIntensity = 1.4,
  autoResumeDelay = 2500,
}) {
  const containerRef = useRef(null);
  const fallbackRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, dx: 0, dy: 0, active: false, lastMove: 0 });

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof window === "undefined") {
      return undefined;
    }

    const fallbackElement = fallbackRef.current;
    if (fallbackElement) fallbackElement.hidden = false;

    const canvas = document.createElement("canvas");
    let gl;
    let resources;
    try {
      gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        powerPreference: "low-power",
      });
      if (!gl) return undefined;
      resources = createResources(gl, colors, cursorSize);
    } catch {
      // WebGL or shader compilation can be unavailable; retain the static image.
      return undefined;
    }
    Object.assign(canvas.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
      pointerEvents: "auto", visibility: "hidden",
    });
    container.appendChild(canvas);

    const safeResolution = Math.max(0.2, Math.min(1, resolution));
    const mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0, force: 0 };
    let frameId = null;
    let previousFrameTime = null;
    let elapsed = 0;
    let inView = !("IntersectionObserver" in window);
    let contextLost = false;
    let failed = false;
    let disposed = false;
    let showingFallback = true;

    const shouldAnimate = () =>
      inView && document.visibilityState === "visible" && !contextLost && !failed && !disposed;

    const pause = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      previousFrameTime = null;
    };

    const showFallback = () => {
      pause();
      canvas.style.visibility = "hidden";
      if (fallbackElement) fallbackElement.hidden = false;
      showingFallback = true;
    };

    const handleRenderFailure = () => {
      failed = true;
      showFallback();
    };

    const resize = () => {
      if (contextLost || disposed) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * safeResolution;
      const width = Math.max(1, Math.floor(container.clientWidth * pixelRatio));
      const height = Math.max(1, Math.floor(container.clientHeight * pixelRatio));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const updatePointer = (event) => {
      if (!shouldAnimate()) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const pointer = pointerRef.current;
      pointer.dx = inside ? x - pointer.x : 0;
      pointer.dy = inside ? y - pointer.y : 0;
      if (inside) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.active = inside;
      pointer.lastMove = performance.now();
    };

    const animate = (now) => {
      frameId = null;
      if (!shouldAnimate()) {
        pause();
        return;
      }
      if (previousFrameTime !== null) elapsed += (now - previousFrameTime) / 1000;
      previousFrameTime = now;
      const pointer = pointerRef.current;
      const useAutoDemo = autoDemo && now - pointer.lastMove > autoResumeDelay;

      if (useAutoDemo) {
        const x = 0.5 + Math.cos(elapsed * autoSpeed) * 0.24;
        const y = 0.5 + Math.sin(elapsed * autoSpeed * 0.82) * 0.22;
        mouse.x = x;
        mouse.y = y;
        mouse.dx = -Math.sin(elapsed * autoSpeed) * 0.24;
        mouse.dy = Math.cos(elapsed * autoSpeed * 0.82) * 0.18;
        mouse.force = autoIntensity;
      } else {
        mouse.x += (pointer.x - mouse.x) * 0.18;
        mouse.y += (pointer.y - mouse.y) * 0.18;
        mouse.dx += (pointer.dx * (pointer.active ? 18 : 0) - mouse.dx) * 0.22;
        mouse.dy += (pointer.dy * (pointer.active ? 18 : 0) - mouse.dy) * 0.22;
        mouse.force += ((pointer.active ? mouseForce : 0) - mouse.force) * 0.08;
      }

      try {
        const { uniforms } = resources;
        gl.uniform1f(uniforms.uTime, elapsed);
        gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
        gl.uniform2f(uniforms.uMouseDelta, mouse.dx, mouse.dy);
        gl.uniform1f(uniforms.uMouseForce, mouse.force);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // Verify initial/restored setup once; avoid a driver readback every frame.
        if (showingFallback && gl.getError() !== gl.NO_ERROR) {
          throw new Error("WebGL drawing failed");
        }
      } catch {
        handleRenderFailure();
      }
      if (!shouldAnimate()) return;
      if (showingFallback) {
        canvas.style.visibility = "visible";
        if (fallbackElement) fallbackElement.hidden = true;
        showingFallback = false;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    const updateAnimation = () => {
      if (!shouldAnimate()) {
        pause();
      } else if (frameId === null) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const handleContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      // A lost context invalidates and releases every GPU object automatically.
      resources = null;
      showFallback();
    };

    const handleContextRestored = () => {
      if (disposed) return;
      try {
        resources = createResources(gl, colors, cursorSize);
        contextLost = false;
        failed = false;
        resize();
        updateAnimation();
      } catch {
        handleRenderFailure();
      }
    };

    const intersectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio > 0;
        updateAnimation();
      })
      : null;
    const resizeObserver = new ResizeObserver(resize);
    intersectionObserver?.observe(container);
    resizeObserver.observe(container);
    document.addEventListener("visibilitychange", updateAnimation);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    resize();
    updateAnimation();

    return () => {
      disposed = true;
      pause();
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("visibilitychange", updateAnimation);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      intersectionObserver?.disconnect();
      resizeObserver.disconnect();
      disposeResources(gl, resources);
      canvas.remove();
    };
  }, [
    autoDemo,
    autoIntensity,
    autoResumeDelay,
    autoSpeed,
    colors,
    cursorSize,
    mouseForce,
    resolution,
  ]);

  return (
    <div ref={containerRef} className="liquid-ether-container" aria-hidden="true">
      <div ref={fallbackRef} className="absolute inset-0">{fallback}</div>
    </div>
  );
}
