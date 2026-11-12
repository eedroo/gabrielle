"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logout } from "@/app/admin/actions/auth";
import { Close, Menu } from "@/components/ui/Icons";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/travels", label: "Travels" },
  { href: "/admin/photos", label: "Photos & videos" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/lifestyle", label: "Lifestyle" },
  { href: "/admin/links", label: "Links & contacts" },
  { href: "/admin/account", label: "Account" },
];

export function AdminShell({ name, warning, children }: { name: string; warning?: string | null; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <nav aria-label="Backoffice" className="flex h-full flex-col">
      <Link href="/admin" className="font-display text-2xl uppercase tracking-[0.28em] text-warm-ivory">
        Gabrielle
      </Link>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-soft-taupe">Backoffice</p>
      <ul className="mt-10 space-y-1">
        {nav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-3 py-2.5 text-sm transition ${
                  active ? "bg-warm-ivory/10 text-champagne" : "text-warm-ivory/75 hover:bg-warm-ivory/5 hover:text-warm-ivory"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto space-y-2 border-t border-warm-ivory/10 pt-5 text-sm">
        <a href="/" target="_blank" rel="noopener noreferrer" className="block rounded-md px-3 py-2 text-warm-ivory/75 hover:text-champagne">
          View website ↗
        </a>
        <form action={logout}>
          <button type="submit" className="block w-full rounded-md px-3 py-2 text-left text-warm-ivory/75 hover:text-champagne">
            Log out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-svh bg-[#f7f3ec] text-obsidian lg:flex">
      <aside className="hidden w-64 shrink-0 bg-obsidian p-6 lg:block lg:sticky lg:top-0 lg:h-svh">{sidebar}</aside>

      <div className="flex items-center justify-between bg-obsidian px-5 py-4 lg:hidden">
        <span className="font-display text-xl uppercase tracking-[0.28em] text-warm-ivory">Gabrielle</span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="text-warm-ivory">
          <Menu width={22} height={22} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-obsidian p-6 lg:hidden">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-5 top-5 text-warm-ivory">
            <Close width={22} height={22} />
          </button>
          {sidebar}
        </div>
      )}

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <p className="mb-6 text-sm text-obsidian/55">Hello, {name}</p>
        {warning && (
          <p role="alert" className="mx-auto mb-8 max-w-6xl rounded-lg border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {warning}
          </p>
        )}
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
