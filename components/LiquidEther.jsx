"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./LiquidEther.css";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseForce;
  uniform float uCursorSize;
  uniform vec2 uMouseDelta;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec2 vUv;

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

    gl_FragColor = vec4(color, alpha);
  }
`;

function hexToColor(hex) {
  return new THREE.Color(hex);
}

export default function LiquidEther({
  colors = ["#8b5cf6", "#c084fc", "#93c5fd"],
  mouseForce = 12,
  cursorSize = 90,
  resolution = 0.35,
  autoDemo = true,
  autoSpeed = 0.35,
  autoIntensity = 1.4,
  autoResumeDelay = 2500,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const uniformsRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, dx: 0, dy: 0, active: false, lastMove: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof window === "undefined") {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "auto";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const safeResolution = Math.max(0.2, Math.min(1, resolution));
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseDelta: { value: new THREE.Vector2(0, 0) },
      uMouseForce: { value: 0 },
      uCursorSize: { value: cursorSize / 1000 },
      uColorA: { value: hexToColor(colors[0] ?? "#8b5cf6") },
      uColorB: { value: hexToColor(colors[1] ?? "#c084fc") },
      uColorC: { value: hexToColor(colors[2] ?? "#93c5fd") },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * safeResolution);
      renderer.setSize(width, height, false);
    };

    const updatePointer = (event) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const previous = pointerRef.current;

      pointerRef.current = {
        x: inside ? x : pointerRef.current.x,
        y: inside ? y : pointerRef.current.y,
        dx: inside ? x - previous.x : 0,
        dy: inside ? y - previous.y : 0,
        active: inside,
        lastMove: performance.now(),
      };
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    resize();

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const now = performance.now();
      const pointer = pointerRef.current;
      const useAutoDemo = autoDemo && now - pointer.lastMove > autoResumeDelay;

      uniforms.uTime.value = elapsed;

      if (useAutoDemo) {
        const x = 0.5 + Math.cos(elapsed * autoSpeed) * 0.24;
        const y = 0.5 + Math.sin(elapsed * autoSpeed * 0.82) * 0.22;
        uniforms.uMouse.value.set(x, y);
        uniforms.uMouseDelta.value.set(
          -Math.sin(elapsed * autoSpeed) * 0.24,
          Math.cos(elapsed * autoSpeed * 0.82) * 0.18,
        );
        uniforms.uMouseForce.value = autoIntensity;
      } else {
        uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.18);
        uniforms.uMouseDelta.value.lerp(
          new THREE.Vector2(pointer.dx, pointer.dy).multiplyScalar(pointer.active ? 18 : 0),
          0.22,
        );
        uniforms.uMouseForce.value +=
          ((pointer.active ? mouseForce : 0) - uniforms.uMouseForce.value) * 0.08;
      }

      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", updatePointer);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      uniformsRef.current = null;
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

  return <div ref={containerRef} className="liquid-ether-container" aria-hidden="true" />;
}
