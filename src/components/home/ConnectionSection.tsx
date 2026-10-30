import { home } from "@/content/home";
import { Divider } from "@/components/ui/Divider";
import { Paragraphs } from "@/components/ui/Paragraphs";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ConnectionSection() {
  const { connection } = home;
  return (
    <section className="section bg-warm-ivory text-obsidian">
      <div className="container-site max-w-3xl text-center" data-reveal>
        <SectionHeading eyebrow={connection.eyebrow} title={<em className="font-light">{connection.title}</em>} tone="dark" align="center" />
        <Divider className="mx-auto mt-10 max-w-40 text-muted-gold" />
        <Paragraphs items={connection.paragraphs} className="mx-auto mt-10 max-w-xl text-obsidian/75" />
      </div>
    </section>
  );
}
