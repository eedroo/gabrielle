import Image from "next/image";
import type { ImageContent } from "@/content/home";

type Props = {
  image: ImageContent;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Placeholder mood while final photography is not in place */
  tone?: "dark" | "warm";
};

/**
 * Renders the final photograph when `image.src` is set; otherwise an
 * on-brand placeholder that is clearly identified as such (never shipped).
 */
export function EditorialImage({ image, className = "", sizes = "100vw", priority, tone = "dark" }: Props) {
  // Background images pass "absolute"; adding "relative" too would collapse them to zero height.
  const position = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative";

  if (image.src) {
    return (
      <div className={`${position} overflow-hidden ${className}`}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const gradient =
    tone === "warm"
      ? "radial-gradient(120% 90% at 70% 20%, #6b4a32 0%, #3a2618 45%, #1a120d 100%)"
      : "radial-gradient(110% 80% at 65% 25%, #4a3324 0%, #241912 50%, #11100f 100%)";

  return (
    <div
      role="img"
      aria-label={image.alt}
      data-placeholder="image"
      className={`${position} overflow-hidden ${className}`}
      style={{ background: gradient }}
    >
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="absolute bottom-3 left-3 text-[0.625rem] uppercase tracking-[0.2em] text-warm-ivory/35">
        Photo · {image.alt}
      </span>
    </div>
  );
}
