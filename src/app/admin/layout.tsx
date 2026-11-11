import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Backoffice · Gabrielle" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-[#f7f3ec] text-obsidian">{children}</div>;
}
