import type { Channel } from "@/lib/channels";
import { Instagram, Mail, OnlyFans, Telegram, WhatsApp, XLogo } from "@/components/ui/Icons";

export const channelIcons = {
  instagram: Instagram,
  onlyfans: OnlyFans,
  x: XLogo,
  telegram: Telegram,
  whatsapp: WhatsApp,
  email: Mail,
} as const;

/** Props for an outbound channel link (mail opens in place, the rest in a new tab). */
export const channelLinkProps = (href: string) =>
  href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer me" };

type Props = { channels: Channel[]; className?: string; size?: number };

export function SocialLinks({ channels, className = "", size = 18 }: Props) {
  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {channels.map(({ key, label, href }) => {
        const Icon = channelIcons[key];
        return (
          <li key={key}>
            <a
              href={href}
              {...channelLinkProps(href)}
              aria-label={label}
              className="block opacity-80 transition hover:text-champagne hover:opacity-100"
            >
              <Icon width={size} height={size} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
