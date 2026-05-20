"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const LiquidEther = dynamic(() => import("./LiquidEther"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[radial-gradient(circle_at_24%_20%,rgba(82,39,255,0.44),transparent_13rem),radial-gradient(circle_at_78%_34%,rgba(255,159,252,0.34),transparent_15rem),linear-gradient(135deg,rgba(255,255,255,0.56),rgba(248,239,255,0.38)_50%,rgba(223,247,255,0.32))] dark:bg-[radial-gradient(circle_at_24%_20%,rgba(82,39,255,0.72),transparent_13rem),radial-gradient(circle_at_78%_34%,rgba(255,159,252,0.58),transparent_15rem),linear-gradient(135deg,#100b1f,#21123e_52%,#0b1027)]" />
  ),
});

export default function HeroLiquidBackground() {
  const { isDark } = useTheme();
  const [canAnimate, setCanAnimate] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const colors = isDark ? ["#5227FF", "#FF9FFC", "#B497CF"] : ["#8B5CF6", "#C084FC", "#93C5FD"];

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setCanAnimate(!motionQuery.matches);
      setIsCompact(compactQuery.matches);
    };

    update();
    motionQuery.addEventListener("change", update);
    compactQuery.addEventListener("change", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      compactQuery.removeEventListener("change", update);
    };
  }, []);

  if (!canAnimate || isCompact) {
    return (
      <div
        aria-hidden="true"
        className="h-full w-full bg-[radial-gradient(circle_at_22%_18%,rgba(82,39,255,0.46),transparent_13rem),radial-gradient(circle_at_78%_30%,rgba(255,159,252,0.34),transparent_14rem),radial-gradient(circle_at_54%_76%,rgba(180,151,207,0.28),transparent_15rem),linear-gradient(135deg,rgba(255,255,255,0.55),rgba(248,239,255,0.36)_52%,rgba(223,247,255,0.28))] dark:bg-[radial-gradient(circle_at_22%_18%,rgba(82,39,255,0.82),transparent_13rem),radial-gradient(circle_at_78%_30%,rgba(255,159,252,0.58),transparent_14rem),radial-gradient(circle_at_54%_76%,rgba(180,151,207,0.44),transparent_15rem),linear-gradient(135deg,#100b1f,#21123e_52%,#0b1027)]"
      />
    );
  }

  return (
    <LiquidEther
      colors={colors}
      mouseForce={36}
      cursorSize={140}
      isViscous={false}
      viscous={30}
      iterationsViscous={32}
      iterationsPoisson={32}
      resolution={0.55}
      isBounce={false}
      autoDemo
      autoSpeed={0.35}
      autoIntensity={1.4}
      takeoverDuration={0.25}
      autoResumeDelay={2500}
      autoRampDuration={0.6}
    />
  );
}
