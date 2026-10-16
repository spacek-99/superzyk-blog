import type { PostHeading } from "@/lib/posts";
import { useEffect, useState } from "react";

export function useArticleReadingPosition(headings: PostHeading[]) {
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

    let scrollFrame: number | null = null;

    const updateActiveHeading = () => {
      scrollFrame = null;
      const scrollOffset = Number.parseFloat(window.getComputedStyle(headingElements[0]).scrollMarginTop) || 96;
      const activationLine = Math.max(scrollOffset + 2, window.innerHeight * 0.18);
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
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [headings]);

  return { activeId, setActiveId };
}
