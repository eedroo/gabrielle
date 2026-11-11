import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TravelTicker } from "@/components/layout/TravelTicker";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { RevealObserver } from "@/components/ui/Reveal";
import { getChannels } from "@/lib/settings";

/** Public website chrome: header, travel ticker, footer and floating WhatsApp. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { social, contact } = await getChannels();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-champagne focus:px-4 focus:py-2 focus:text-obsidian">
        Skip to content
      </a>
      <Header social={social} contact={contact} />
      <TravelTicker />
      <main id="main">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <RevealObserver />
    </>
  );
}
