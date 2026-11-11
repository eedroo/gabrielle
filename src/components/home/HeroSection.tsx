import { home } from "@/content/home";
import { site } from "@/content/site";
import { BackgroundMedia } from "@/components/ui/BackgroundMedia";
import { ArrowDown, WhatsApp } from "@/components/ui/Icons";

export function HeroSection() {
  const { hero } = home;
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] flex-col items-center justify-center overflow-hidden lg:min-h-[calc(100svh-7.5rem)]">
      <BackgroundMedia image={hero.media} video={hero.media.video} priority />
      <div className="absolute inset-0 -z-10 bg-obsidian/45" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-obsidian/80 to-transparent" />

      {/* Kept in the page for search engines and screen readers; visually the video speaks. */}
      <div className="sr-only">
        <p>{hero.eyebrow}</p>
        <p>{hero.text}</p>
      </div>

      <div className="flex flex-col items-center px-6 text-center">
        <p className="font-display text-5xl uppercase tracking-[0.32em] text-warm-ivory [text-indent:0.32em] sm:text-7xl lg:text-8xl">
          {site.name}
        </p>
        <a
          href={hero.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={hero.whatsapp.label}
          className="mt-10 flex size-14 items-center justify-center rounded-full border border-warm-ivory/40 text-warm-ivory backdrop-blur-sm transition hover:border-champagne hover:bg-champagne hover:text-obsidian"
        >
          <WhatsApp width={24} height={24} />
        </a>
        <a href={hero.scroll.href} aria-label={hero.scroll.label} className="mt-10 p-2 text-warm-ivory/80 transition hover:text-champagne">
          <ArrowDown width={22} height={22} className="animate-scroll-cue" />
        </a>
      </div>

      <h1 className="absolute bottom-8 right-[var(--page-padding)] max-w-[13rem] text-right font-display text-2xl font-normal italic leading-tight text-champagne/90 lg:bottom-10 lg:max-w-[15rem] lg:text-3xl">
        {hero.title}
      </h1>
    </section>
  );
}
