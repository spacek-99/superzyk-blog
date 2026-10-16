"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { isDark, mounted, toggleTheme } = useTheme();
  return (
    <button type="button" className="theme-toggle" aria-label={mounted ? (isDark ? "切换到白天模式" : "切换到黑夜模式") : "切换主题"} aria-pressed={isDark} disabled={!mounted} onClick={toggleTheme}>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isDark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42m-11.3 11.3-1.42 1.42" /></> : <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z" />}
      </svg>
    </button>
  );
}
