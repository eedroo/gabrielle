"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/gallery";
import { ArrowRight, Close } from "@/components/ui/Icons";

type Collection = { id: string; label: string; photos: GalleryPhoto[] };

export function GalleryGrid({ collections, allLabel }: { collections: Collection[]; allLabel: string }) {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const photos = active === "all" ? collections.flatMap((c) => c.photos) : collections.find((c) => c.id === active)?.photos ?? [];

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open !== null ? photos[open] : null;

  return (
    <>
      {collections.length > 1 && (
        <div role="tablist" aria-label="Collections" className="-mx-[var(--page-padding)] mt-10 flex gap-2 overflow-x-auto px-[var(--page-padding)] [scrollbar-width:none]">
          {[{ id: "all", label: allLabel }, ...collections].map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={`min-h-11 shrink-0 border px-5 text-[0.6875rem] uppercase tracking-[0.2em] transition ${
                active === c.id ? "border-champagne bg-champagne text-obsidian" : "border-warm-ivory/20 text-warm-ivory/80 hover:border-champagne hover:text-champagne"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} className={i % 7 === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open ${p.alt}`}
              className="group relative block h-full w-full overflow-hidden"
            >
              <div className={`relative w-full ${i % 7 === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-[4/5]"}`}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-label="Photo viewer"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-obsidian/95 p-0 text-warm-ivory backdrop:bg-obsidian/80"
      >
        {current && (
          <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
            <div className="flex items-center justify-between px-5 py-4 text-[0.6875rem] uppercase tracking-[0.2em] text-soft-taupe">
              <span>
                {open! + 1} / {photos.length}
              </span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="p-2 hover:text-champagne">
                <Close width={22} height={22} />
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex justify-center gap-3 px-5 py-5">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="border border-warm-ivory/20 p-3 hover:border-champagne hover:text-champagne">
                <ArrowRight width={18} height={18} className="rotate-180" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="border border-warm-ivory/20 p-3 hover:border-champagne hover:text-champagne">
                <ArrowRight width={18} height={18} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
