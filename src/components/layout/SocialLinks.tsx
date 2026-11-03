import { contactLinks, site } from "@/content/site";
import { Instagram, Mail, OnlyFans, Telegram, WhatsApp, XLogo } from "@/components/ui/Icons";

export const socialChannels = [
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "OnlyFans", href: site.social.onlyfans, Icon: OnlyFans },
  { label: "X / Twitter", href: site.social.x, Icon: XLogo },
] as const;

export const contactChannels = [
  { label: "WhatsApp", href: contactLinks.whatsapp(), Icon: WhatsApp },
  { label: "Telegram", href: contactLinks.telegram(), Icon: Telegram },
  { label: "Email", href: contactLinks.email(), Icon: Mail },
] as const;

type Props = { channels?: "social" | "contact" | "all"; className?: string; size?: number };

export function SocialLinks({ channels = "social", className = "", size = 18 }: Props) {
  const list =
    channels === "social" ? socialChannels : channels === "contact" ? contactChannels : [...socialChannels, ...contactChannels];
  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {list.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer me"
            aria-label={label}
            className="block opacity-80 transition hover:text-champagne hover:opacity-100"
          >
            <Icon width={size} height={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
