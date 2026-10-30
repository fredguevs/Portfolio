import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 text-center text-[0.8125rem] text-muted">
      © 2026 {site.name.toLowerCase()}
    </footer>
  );
}
