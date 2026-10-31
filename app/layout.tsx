import type { Metadata } from "next";
import { IBM_Plex_Sans, Pixelify_Sans } from "next/font/google";
import { Cat } from "@/components/Cat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  // Cyrillic for "Русский" on the home page.
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-pixelify",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

// Runs before first paint: saved choice wins, otherwise follow the system.
const themeScript = `
try {
  var t = localStorage.getItem("theme");
  if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {/* Bottom padding keeps the end of the page clear of the cat's floor. */}
        <div className="mx-auto max-w-[40rem] px-5 pt-8 pb-20 sm:pt-12">
          <Header />
          <main className="mt-12 sm:mt-16">{children}</main>
          <Footer />
        </div>
        <Cat />
      </body>
    </html>
  );
}
