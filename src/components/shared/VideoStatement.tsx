import type { ImageContent } from "@/content/home";
import type { VideoSource } from "@/lib/images";
import { BackgroundMedia } from "@/components/ui/BackgroundMedia";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Paragraphs } from "@/components/ui/Paragraphs";

type Props = {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  cta: { readonly label: string; readonly href: string };
  media: ImageContent & { video: VideoSource | null };
};

/** Centred editorial statement over a background video, with a call to action. */
export function VideoStatement({ eyebrow, title, paragraphs, cta, media }: Props) {
  return (
    <section className="relative isolate overflow-hidden">
      <BackgroundMedia image={media} video={media.video} />
      <div className="absolute inset-0 -z-10 bg-obsidian/65" />
      <div className="container-site section max-w-3xl text-center" data-reveal>
        {eyebrow && <p className="eyebrow text-champagne">{eyebrow}</p>}
        <h2 className="h2 mt-5 text-balance">
          <em className="font-light">{title}</em>
        </h2>
        <Divider className="mx-auto mt-10 max-w-40 text-champagne" />
        <Paragraphs items={paragraphs} className="mx-auto mt-10 max-w-xl text-warm-ivory/85" />
        <Button href={cta.href} className="mt-10">
          {cta.label}
        </Button>
      </div>
    </section>
  );
}
