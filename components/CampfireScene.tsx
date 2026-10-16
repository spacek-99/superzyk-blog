"use client";

import { useEffect, useRef, useState } from "react";
import { createCampfireParticles } from "./campfire-particles";
import "./campfire-scene.css";

type SceneControls = {
  toggle: () => void;
  burst: () => void;
  point: (x: number, y: number) => void;
};
type DataConnection = EventTarget & { saveData?: boolean };

export default function CampfireScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<SceneControls | null>(null);
  const [active, setActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!scene || !video || !canvas) return;

    const particles = createCampfireParticles(canvas);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    let visible = false;
    let manualChoice: boolean | null = null;
    let running = false;
    let failed = false;
    let disposed = false;
    let playRequest = 0;

    const fallback = () => {
      if (disposed) return;
      failed = true;
      running = false;
      playRequest += 1;
      video.pause();
      video.removeAttribute("src");
      video.load();
      particles.setRunning(false);
      setActive(false);
      setVideoReady(false);
    };

    const reconcile = () => {
      const permitted = manualChoice ?? !(reducedMotion.matches || connection?.saveData);
      const next = visible && !document.hidden && permitted && !failed;
      if (next === running) return;
      running = next;
      setActive(next);
      particles.setRunning(next);
      const request = ++playRequest;
      if (!next) {
        video.pause();
        return;
      }
      // No video request is made until the scene is visible and motion is allowed.
      if (!video.getAttribute("src")) video.src = "/videos/campfire-pixel.mp4";
      video.play().catch(() => {
        if (!disposed && request === playRequest && running) fallback();
      });
    };
    const onPlaying = () => setVideoReady(true);
    const onPreferenceChange = () => {
      // Newly requested reductions win; unrelated network changes keep a manual pause.
      if (reducedMotion.matches || connection?.saveData) manualChoice = null;
      reconcile();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      reconcile();
    }, { threshold: 0.02 });

    controls.current = {
      toggle() {
        manualChoice = !running;
        failed = false;
        reconcile();
      },
      burst() { if (running) particles.burst(); },
      point(x, y) { particles.point(x, y); },
    };
    observer.observe(scene);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", fallback);
    reducedMotion.addEventListener("change", onPreferenceChange);
    connection?.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", reconcile);

    return () => {
      disposed = true;
      playRequest += 1;
      controls.current = null;
      observer.disconnect();
      reducedMotion.removeEventListener("change", onPreferenceChange);
      connection?.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", reconcile);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", fallback);
      video.pause();
      video.removeAttribute("src");
      video.load();
      particles.destroy();
    };
  }, []);

  return (
    <div className="campfire-scene" ref={sceneRef}>
      <div className="campfire-scene-art">
        {/* eslint-disable-next-line @next/next/no-img-element -- This fixed-size WebP is precompressed; a native poster avoids adding the Image client runtime. */}
        <img
          className="campfire-scene-poster"
          src="/images/campfire-pixel.webp"
          alt="星空下的大树旁，男孩坐在篝火左侧，猫和狗依偎在右侧。"
          width={576}
          height={576}
          decoding="async"
          loading="eager"
        />
        <video
          className="campfire-scene-video"
          data-ready={videoReady}
          ref={videoRef}
          preload="none"
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        />
        <canvas className="campfire-scene-stars" ref={canvasRef} aria-hidden="true" />
      </div>
      <button
        className="campfire-scene-touch"
        type="button"
        aria-label={active ? "轻触篝火，点亮火星" : "播放营火动画"}
        onClick={() => active ? controls.current?.burst() : controls.current?.toggle()}
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          controls.current?.point((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => controls.current?.point(0, 0)}
        onBlur={() => controls.current?.point(0, 0)}
      />
      <button
        className="campfire-scene-toggle"
        type="button"
        aria-label={active ? "暂停营火动画" : "播放营火动画"}
        title={active ? "暂停动画" : "播放动画"}
        onClick={() => controls.current?.toggle()}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {active ? <path d="M7 5v10M13 5v10" /> : <path d="m7 4 9 6-9 6Z" />}
        </svg>
      </button>
    </div>
  );
}
