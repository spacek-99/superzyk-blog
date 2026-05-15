"use client";

import type { PostHeading } from "@/lib/posts";
import { useEffect, useState } from "react";

type ArticleTocProps = {
  headings: PostHeading[];
};

export default function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="article-toc">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[var(--site-faint)]">
        本页目录
      </p>
      <nav aria-label="文章目录" className="article-toc-nav">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                window.history.replaceState(null, "", `#${heading.id}`);
                setActiveId(heading.id);
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
