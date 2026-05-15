"use client";

export default function BackToTop() {
  return (
    <button
      type="button"
      aria-label="返回顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="article-back-to-top"
    >
      ↑
    </button>
  );
}
