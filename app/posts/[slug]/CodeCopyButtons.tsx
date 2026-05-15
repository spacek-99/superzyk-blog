"use client";

import { useEffect } from "react";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function CodeCopyButtons() {
  useEffect(() => {
    const buttons: HTMLButtonElement[] = [];
    const codeBlocks = document.querySelectorAll<HTMLElement>(
      ".article-content pre.command-block[data-copyable='true']",
    );

    codeBlocks.forEach((pre) => {
      if (pre.querySelector("[data-code-copy-button='true']")) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "复制";
      button.dataset.codeCopyButton = "true";
      button.className = "code-copy-button";

      let resetTimer: number | undefined;

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        await copyText(code.trimEnd());
        button.textContent = "已复制";

        if (resetTimer) {
          window.clearTimeout(resetTimer);
        }

        resetTimer = window.setTimeout(() => {
          button.textContent = "复制";
        }, 1500);
      });

      pre.appendChild(button);
      buttons.push(button);
    });

    return () => {
      buttons.forEach((button) => button.remove());
    };
  }, []);

  return null;
}
