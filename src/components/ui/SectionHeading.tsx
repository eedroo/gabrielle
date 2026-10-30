import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, as: Tag = "h2", tone = "light", align = "left", className = "" }: Props) {
  const eyebrowColor = tone === "light" ? "text-champagne" : "text-muted-gold";
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <p className={`eyebrow ${eyebrowColor}`}>{eyebrow}</p>
      <Tag className={`${Tag === "h1" ? "h1" : "h2"} mt-5 text-balance`}>{title}</Tag>
    </div>
  );
}
