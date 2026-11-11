"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/content/site";
import { Close, Menu } from "@/components/ui/Icons";
import type { Channel } from "@/lib/channels";
import { SocialLinks } from "./SocialLinks";

export function Header({ social, contact }: { social: Channel[]; contact: Channel[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        open ? "bg-obsidian" : scrolled ? "bg-obsidian/95 backdrop-blur-md" : "bg-obsidian"
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between lg:h-20">
        <Link href="/" className="font-display text-2xl tracking-[0.28em] uppercase lg:text-[1.65rem]">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.6875rem] uppercase tracking-[0.2em]">
            {navigation.map((item) => {
              const active = pathname === item.href;
              const isBook = item.href === "/book-me";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      isBook
                        ? "border border-champagne/70 px-4 py-2.5 text-champagne transition hover:bg-champagne hover:text-obsidian"
                        : `relative py-2 transition hover:text-champagne ${
                            active ? "text-champagne after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-champagne" : "text-warm-ivory/85"
                          }`
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <SocialLinks channels={social} className="hidden lg:flex" size={16} />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 p-2 lg:hidden"
        >
          {open ? <Close width={24} height={24} /> : <Menu width={24} height={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-obsidian lg:hidden"
      >
        <nav aria-label="Mobile" className="container-site flex min-h-full flex-col py-10">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`block py-2.5 font-display text-4xl transition hover:text-champagne ${
                    pathname === item.href ? "text-champagne" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/book-me"
            className="mt-10 inline-flex min-h-12 items-center justify-center bg-champagne px-7 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-obsidian"
          >
            Book Me
          </Link>
          <div className="mt-auto border-t border-warm-ivory/10 pt-8">
            <SocialLinks channels={[...social, ...contact]} size={20} className="flex-wrap" />
          </div>
        </nav>
      </div>
    </header>
  );
}
