import Link from "next/link";
import { isExternalHref } from "@/content/site";
import type { ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "outline-light" | "outline-dark" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-champagne text-obsidian border-champagne hover:bg-warm-ivory hover:border-warm-ivory",
  "outline-light":
    "border-warm-ivory/60 text-warm-ivory hover:border-champagne hover:text-champagne",
  "outline-dark":
    "border-obsidian/70 text-obsidian hover:bg-obsidian hover:text-warm-ivory",
  dark: "bg-obsidian text-champagne border-obsidian hover:bg-deep-brown",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", arrow = true, className = "" }: Props) {
  const classes = `group inline-flex min-h-12 items-center justify-center gap-3 border px-7 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );
  // Outbound links (incl. the /whatsapp redirect) open in a new tab and skip prefetching.
  return isExternalHref(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
