"use client";

import { useTheme } from "./ThemeProvider";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ThemeToggle() {
  const { isDark, mounted, toggleTheme } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="切换主题"
        disabled
        className="relative h-9 w-[4.25rem] rounded-full border border-[#dec8ff] bg-[#fff8ef] p-1 opacity-70"
      >
        <span className="relative block h-7 w-7 translate-x-8 rounded-full bg-[#8b5cf6] shadow-lg" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "切换到白天模式" : "切换到黑夜模式"}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-[4.25rem] rounded-full border p-1 transition-colors",
        isDark ? "border-cyan-300/30 bg-slate-950" : "border-[#dec8ff] bg-[#fff8ef]",
      )}
    >
      <span
        className={cn(
          "absolute left-2.5 top-1/2 -translate-y-1/2 text-xs transition-opacity",
          isDark ? "opacity-100" : "opacity-35",
        )}
      >
        夜
      </span>
      <span
        className={cn(
          "absolute right-2.5 top-1/2 -translate-y-1/2 text-xs transition-opacity",
          isDark ? "opacity-35" : "opacity-100",
        )}
      >
        日
      </span>
      <span
        className={cn(
          "relative block h-7 w-7 rounded-full shadow-lg transition-transform duration-300",
          isDark ? "translate-x-0 bg-cyan-200" : "translate-x-8 bg-[#8b5cf6]",
        )}
      />
    </button>
  );
}
