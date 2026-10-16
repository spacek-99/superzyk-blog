"use client";

import type { PostHeading } from "@/lib/posts";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { useArticleReadingPosition } from "./useArticleReadingPosition";

type ArticleTocProps = {
  headings: PostHeading[];
};

export default function ArticleToc({ headings }: ArticleTocProps) {
  const { activeId, setActiveId } = useArticleReadingPosition(headings);
  const [isOpen, setIsOpen] = useState(false);
  const navId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigationFrameRef = useRef<number | null>(null);
  const activeHeading = headings.find((heading) => heading.id === activeId);

  useEffect(() => () => {
    if (navigationFrameRef.current !== null) window.cancelAnimationFrame(navigationFrameRef.current);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !window.matchMedia("(min-width: 1100px)").matches) return;
    // Leave a person browsing the directory in control until the next chapter change.
    if (nav.matches(":hover") || nav.contains(document.activeElement)) return;

    const activeLink = nav.querySelector<HTMLElement>('[aria-current="location"]');
    if (!activeLink) return;
    const bounds = nav.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();
    const inset = 8;
    const offset = linkBounds.top < bounds.top + inset
      ? linkBounds.top - bounds.top - inset
      : linkBounds.bottom > bounds.bottom - inset
        ? linkBounds.bottom - bounds.bottom + inset
        : 0;
    // Only move the directory's own scroll area, never the document.
    if (offset) nav.scrollBy({ top: offset, behavior: "instant" });
  }, [activeId]);

  if (headings.length === 0) {
    return null;
  }

  const closeOnEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <aside className="article-toc" data-open={isOpen}>
      <div className="article-toc-header">
        <p className="article-toc-title">本页目录</p>
        <button
          ref={toggleRef}
          type="button"
          className="article-toc-toggle"
          aria-expanded={isOpen}
          aria-controls={navId}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={closeOnEscape}
        >
          <span className="article-toc-toggle-label">本页目录</span>
          <span className="article-toc-current" aria-hidden="true">{activeHeading?.text}</span>
          <span className="article-toc-toggle-action" aria-hidden="true">
            {isOpen ? "收起" : "展开"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={isOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
            </svg>
          </span>
        </button>
      </div>
      <nav ref={navRef} id={navId} aria-label="文章目录" className="article-toc-nav">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <a
              key={heading.id}
              href={`#${encodeURIComponent(heading.id)}`}
              aria-current={isActive ? "location" : undefined}
              onKeyDown={closeOnEscape}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const target = document.getElementById(heading.id);
                if (!target) return;

                event.preventDefault();
                setIsOpen(false);
                setActiveId(heading.id);

                const hash = `#${encodeURIComponent(heading.id)}`;
                if (window.location.hash !== hash) {
                  window.history.pushState(window.history.state, "", hash);
                }

                if (navigationFrameRef.current !== null) window.cancelAnimationFrame(navigationFrameRef.current);
                // Collapse the in-flow menu before measuring the destination.
                navigationFrameRef.current = window.requestAnimationFrame(() => {
                  navigationFrameRef.current = null;
                  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
                  target.focus({ preventScroll: true });
                  target.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                    block: "start",
                  });
                });
              }}
              className={[
                "article-toc-link",
                isActive ? "article-toc-link-active" : "",
                heading.level === 3 ? "article-toc-link-nested" : "",
              ].join(" ")}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
