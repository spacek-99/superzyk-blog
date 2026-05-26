"use client";

import { useEffect, useState } from "react";

type LightboxImage = {
  src: string;
  alt: string;
};

export default function ArticleImageLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    const articleImages = Array.from(document.querySelectorAll<HTMLImageElement>(".article-content img"));

    const openImage = (img: HTMLImageElement) => {
      setImage({
        src: img.currentSrc || img.src,
        alt: img.alt || "文章图片",
      });
    };

    const cleanups = articleImages.map((img) => {
      const handleClick = () => {
        openImage(img);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          openImage(img);
        }
      };

      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.setAttribute("aria-label", "点击放大图片");
      img.addEventListener("click", handleClick);
      img.addEventListener("keydown", handleKeyDown);

      return () => {
        img.removeAttribute("role");
        img.removeAttribute("tabindex");
        img.removeAttribute("aria-label");
        img.removeEventListener("click", handleClick);
        img.removeEventListener("keydown", handleKeyDown);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    if (!image) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={() => setImage(null)}
    >
      <button
        type="button"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-2xl leading-none text-white shadow-lg shadow-black/30 transition hover:border-white/50 hover:bg-white/10"
        aria-label="关闭图片预览"
        onClick={(event) => {
          event.stopPropagation();
          setImage(null);
        }}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      {/* Plain img is intentional here because the source comes from rendered Markdown. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[92vh] max-w-[92vw] object-contain shadow-2xl shadow-black/40"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
