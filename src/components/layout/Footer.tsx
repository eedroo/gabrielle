import Link from "next/link";
import { legalLinks, navigation, site } from "@/content/site";
import { getChannels } from "@/lib/settings";
import { channelLinkProps } from "./SocialLinks";

function FooterList({ title, items }: { title: string; items: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <p className="eyebrow text-champagne">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-warm-ivory/75">
        {items.map((i) => (
          <li key={i.label}>
            {i.external ? (
              <a href={i.href} {...channelLinkProps(i.href)} className="transition hover:text-champagne">
                {i.label}
              </a>
            ) : (
              <Link href={i.href} className="transition hover:text-champagne">
                {i.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const { social, contact } = await getChannels();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-warm-ivory/10 bg-obsidian">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:py-20">
        <div className="text-center md:text-left">
          <Link href="/" className="font-display text-3xl uppercase tracking-[0.3em]">
            {site.name}
          </Link>
          <p className="mt-4 font-display text-xl italic text-champagne">{site.signature}</p>
        </div>
        <FooterList title="Navigation" items={navigation.map((n) => ({ ...n }))} />
        <FooterList title="Contact" items={contact.map(({ label, href }) => ({ label, href, external: true }))} />
        <FooterList title="Social" items={social.map(({ label, href }) => ({ label, href, external: true }))} />
        <FooterList title="Legal" items={legalLinks.map((l) => ({ ...l }))} />
      </div>
      <div className="border-t border-warm-ivory/10">
        <p className="container-site py-6 text-center text-[0.6875rem] uppercase tracking-[0.18em] text-soft-taupe/70 md:text-left">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
