import { home } from "@/content/home";
import { socialChannels } from "@/components/layout/SocialLinks";
import { ArrowRight } from "@/components/ui/Icons";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SocialSection() {
  const { social } = home;
  return (
    <section className="section bg-obsidian">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div className="max-w-lg" data-reveal>
          <SectionHeading eyebrow={social.eyebrow} title={social.title} />
          <Paragraphs items={social.paragraphs} className="mt-7 text-warm-ivory/70" />
        </div>
        <ul className="divide-y divide-warm-ivory/10 border-y border-warm-ivory/10">
          {socialChannels.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                className="group flex items-center gap-5 py-6 transition hover:text-champagne"
              >
                <Icon width={22} height={22} className="text-champagne" />
                <span className="font-display text-3xl">{label}</span>
                <ArrowRight className="ml-auto transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
