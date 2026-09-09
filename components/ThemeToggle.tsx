"use client";

import { useTheme } from "./ThemeProvider";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ThemeToggle() {
  const { isDark, mounted, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "切换到白天模式" : "切换到黑夜模式") : "切换主题"}
      aria-pressed={isDark}
      disabled={!mounted}
      onClick={toggleTheme}
      className="inline-flex h-11 w-[4.25rem] shrink-0 items-center rounded-full text-[var(--site-ink)] disabled:opacity-70"
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative block h-9 w-full rounded-full border transition-colors",
          isDark ? "border-cyan-300/30 bg-slate-950" : "border-[#dec8ff] bg-[#fff8ef]",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-xs",
            isDark ? "right-2.5" : "left-2.5",
          )}
        >
          {isDark ? "日" : "夜"}
        </span>
        <span
          className={cn(
            "absolute left-[3px] top-[3px] block h-7 w-7 rounded-full shadow-lg transition-transform duration-300",
            isDark ? "translate-x-0 bg-cyan-200" : "translate-x-8 bg-[#8b5cf6]",
          )}
        />
      </span>
    </button>
  );
}
