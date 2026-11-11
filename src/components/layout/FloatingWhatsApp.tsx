"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contactLinks } from "@/content/site";
import { WhatsApp } from "@/components/ui/Icons";

/**
 * WhatsApp shortcut, bottom-left on every page. Appears only once the
 * visitor has scrolled past the hero, which has its own WhatsApp action.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("main section");
    if (!hero) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <a
      href={contactLinks.whatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gabrielle on WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
      className={`fixed bottom-5 left-5 z-40 flex size-12 items-center justify-center rounded-full border border-champagne/60 bg-obsidian/85 text-champagne shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 hover:bg-champagne hover:text-obsidian lg:bottom-8 lg:left-8 lg:size-14 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
