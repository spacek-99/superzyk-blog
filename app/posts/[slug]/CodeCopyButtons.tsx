"use client";

import { useEffect } from "react";

const copyableLanguages = new Set([
  "bash",
  "sh",
  "shell",
  "zsh",
  "bat",
  "cmd",
  "powershell",
  "ps1",
  "json",
  "js",
  "ts",
  "tsx",
  "jsx",
  "css",
  "html",
  "yaml",
  "yml",
  "dockerfile",
]);

const textLanguages = new Set(["text", "txt", "plaintext", "plain", "output"]);

function getCodeLanguage(pre: HTMLElement) {
  const code = pre.querySelector("code");
  const languageClass = Array.from(code?.classList ?? []).find((className) =>
    className.startsWith("language-"),
  );

  return languageClass?.replace(/^language-/, "").toLowerCase() ?? "";
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall back below when clipboard permissions are unavailable.
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
    const hosts: HTMLElement[] = [];
    const codeBlocks = new Set(
      document.querySelectorAll<HTMLElement>(
        "article.prose pre, .prose pre, [data-article-content] pre, .article-content pre",
      ),
    );

    codeBlocks.forEach((pre) => {
      if (pre.querySelector("[data-code-copy-button='true']")) {
        return;
      }

      const language = getCodeLanguage(pre);
      const isCopyable = copyableLanguages.has(language);

      pre.classList.add("code-copy-host");
      pre.classList.add(isCopyable ? "code-copy-enabled" : "code-copy-disabled");
      pre.classList.add(
        isCopyable || pre.classList.contains("command-block") ? "code-block-command" : "code-block-text",
      );
      hosts.push(pre);

      if (!isCopyable || textLanguages.has(language)) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "复制";
      button.setAttribute("aria-label", "复制代码");
      button.dataset.codeCopyButton = "true";
      button.className = "code-copy-button";

      let resetTimer: number | undefined;

      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText ?? pre.innerText ?? "";
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
      buttons.forEach((button) => {
        button.remove();
      });
      hosts.forEach((pre) => {
        pre.classList.remove("code-copy-host");
        pre.classList.remove("code-copy-enabled");
        pre.classList.remove("code-copy-disabled");
        pre.classList.remove("code-block-command");
        pre.classList.remove("code-block-text");
      });
    };
  }, []);

  return null;
}
