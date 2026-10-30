import { home } from "@/content/home";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ArrowDown } from "@/components/ui/Icons";

export function HeroSection() {
  const { hero } = home;
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden lg:min-h-[min(88vh,860px)] lg:items-center">
      <EditorialImage image={hero.image} priority className="absolute inset-0 -z-20" />
      {/* Legibility veil: bottom on mobile, left on desktop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent lg:bg-gradient-to-r lg:from-obsidian/90 lg:via-obsidian/40" />

      <div className="container-site pb-24 pt-40 lg:py-28">
        <div className="max-w-xl" data-reveal>
          <p className="eyebrow text-champagne">{hero.eyebrow}</p>
          <h1 className="h1 mt-6 text-balance">{hero.title}</h1>
          <p className="body-copy mt-7 max-w-md text-warm-ivory/80">{hero.text}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="outline-light" arrow={false}>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>

      <p className="absolute bottom-10 right-[var(--page-padding)] hidden max-w-[11rem] text-right font-display text-2xl italic leading-tight text-champagne/80 lg:block">
        {site.signature}
      </p>

      <a
        href="#about"
        aria-label="Scroll to discover more"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-warm-ivory/30 p-2.5 text-warm-ivory/70 transition hover:text-champagne max-lg:[@media(min-height:700px)]:block"
      >
        <ArrowDown width={16} height={16} />
      </a>
    </section>
  );
}
