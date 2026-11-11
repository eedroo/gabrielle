import { contactLinks } from "@/content/site";
import { WhatsApp } from "@/components/ui/Icons";

/** Always-visible WhatsApp shortcut, bottom-left on every page. */
export function FloatingWhatsApp() {
  return (
    <a
      href={contactLinks.whatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Gabrielle on WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex size-12 lg:size-14 items-center justify-center rounded-full border border-champagne/60 bg-obsidian/85 text-champagne shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:bg-champagne hover:text-obsidian lg:bottom-8 lg:left-8"
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
