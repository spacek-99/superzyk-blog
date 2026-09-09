"use client";

import type { PostHeading } from "@/lib/posts";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

type ArticleTocProps = {
  headings: PostHeading[];
};

export default function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const navId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navigationFrameRef = useRef<number | null>(null);
  const activeHeading = headings.find((heading) => heading.id === activeId);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headingElements.length === 0) {
      return;
    }

    let scrollFrame: number | null = null;

    const updateActiveHeading = () => {
      scrollFrame = null;
      const activationLine = Math.max(96, window.innerHeight * 0.18);
      let current = headingElements[0];

      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top > activationLine) break;
        current = heading;
      }

      if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) {
        current = headingElements[headingElements.length - 1];
      }

      setActiveId(current.id);
    };

    const scheduleUpdate = () => {
      if (scrollFrame === null) {
        scrollFrame = window.requestAnimationFrame(updateActiveHeading);
      }
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    const content = headingElements[0].closest(".article-content");
    if (content) resizeObserver.observe(content);

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
      if (navigationFrameRef.current !== null) window.cancelAnimationFrame(navigationFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [headings]);

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
      <p className="article-toc-title">
        本页目录
      </p>
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
        <span className="article-toc-toggle-action" aria-hidden="true">{isOpen ? "收起 −" : "展开 +"}</span>
      </button>
      <nav id={navId} aria-label="文章目录" className="article-toc-nav">
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
