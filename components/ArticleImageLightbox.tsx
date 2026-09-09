"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
  trigger: HTMLImageElement;
};

export default function ArticleImageLightbox() {
  const pathname = usePathname();

  // App Router can reuse this component when moving between articles.
  return <ArticleImageLightboxContent key={pathname} />;
}

function ArticleImageLightboxContent() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeImage = () => {
    dialogRef.current?.close();
    setImage(null);
  };

  useEffect(() => {
    const articleImages = Array.from(document.querySelectorAll<HTMLImageElement>(".article-content img"));

    const openImage = (img: HTMLImageElement) => {
      // Native dialog remembers the opener even when it was clicked with a mouse.
      img.focus({ preventScroll: true });
      setImage({
        src: img.currentSrc || img.src,
        alt: img.alt.trim() || "文章图片",
        trigger: img,
      });
    };

    const cleanups = articleImages.map((img) => {
      const originalAttributes = ["role", "tabindex", "aria-label", "aria-haspopup"].map(
        (name) => [name, img.getAttribute(name)] as const,
      );

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        openImage(img);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!event.repeat) {
            openImage(img);
          }
        }
      };

      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.setAttribute("aria-label", `放大图片：${img.alt.trim() || "文章图片"}`);
      img.setAttribute("aria-haspopup", "dialog");
      img.addEventListener("click", handleClick);
      img.addEventListener("keydown", handleKeyDown);

      return () => {
        originalAttributes.forEach(([name, value]) => {
          if (value === null) {
            img.removeAttribute(name);
          } else {
            img.setAttribute(name, value);
          }
        });
        img.removeEventListener("click", handleClick);
        img.removeEventListener("keydown", handleKeyDown);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!image || !dialog) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Reserve the scrollbar's space so the article does not reflow while open.
    if (scrollbarWidth > 0) {
      const paddingRight = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    // showModal places the dialog in the top layer and makes the page inert.
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (image.trigger.isConnected) {
        image.trigger.focus({ preventScroll: true });
      }
    };
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[100] m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-black/85 p-4 backdrop-blur-sm backdrop:bg-transparent open:flex"
      aria-modal="true"
      aria-label={`图片预览：${image.alt}`}
      onCancel={(event) => {
        event.preventDefault();
        closeImage();
      }}
      onClose={() => setImage(null)}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          // The close button is the preview's only focusable control.
          event.preventDefault();
          closeButtonRef.current?.focus({ preventScroll: true });
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeImage();
        }
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-2xl leading-none text-white shadow-lg shadow-black/30 transition hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label="关闭图片预览"
        onClick={closeImage}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      {/* Plain img is intentional here because the source comes from rendered Markdown. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[92dvh] max-w-[92vw] object-contain shadow-2xl shadow-black/40"
      />
    </dialog>
  );
}
