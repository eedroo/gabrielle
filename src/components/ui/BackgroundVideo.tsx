"use client";

import { useEffect, useRef } from "react";
import type { VideoSource } from "@/lib/images";

/** Muted looping background video. Respects reduced-motion by staying on its first frame. */
export function BackgroundVideo({ video, className = "" }: { video: VideoSource; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (query.matches ? el.pause() : el.play().catch(() => {}));
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className={`h-full w-full object-cover ${className}`}
    >
      {video.mobileSrc && <source src={video.mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
      <source src={video.src} type={video.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
    </video>
  );
}
