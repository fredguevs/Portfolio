"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const pages = [
  { href: "/", label: "about" },
  { href: "/experience", label: "experience" },
  { href: "/projects", label: "projects" },
  { href: "/links", label: "links" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <Link href="/" className="font-pixel text-[1.125rem] text-ink no-underline">
        frederick guevara
      </Link>
      <div className="flex items-center gap-5">
        <nav aria-label="Main" className="flex gap-4 text-[0.9375rem]">
          {pages.map(({ href, label }) => {
            // Static export may add a trailing slash, so compare without it.
            const current = (pathname.replace(/\/$/, "") || "/") === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className={current ? "text-ink" : "text-muted no-underline hover:text-ink"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
