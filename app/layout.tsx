import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { buildNavigation } from "@/lib/navigation";
// KaTeX CSS is imported directly here (not via @import in globals.css)
// so it lands in the page as a first-class stylesheet BEFORE Tailwind's
// pipeline has a chance to prune rules. The visually-hidden-but-screen-
// reader-accessible `.katex-mathml` clipping depends on the full rule
// set making it through. See docs/math-and-typography.md §1.
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EPT-Kompass",
    template: "%s · EPT-Kompass",
  },
  description:
    "Zweisprachiger Lernbegleiter für das B.Sc.-Studium Energie- und Prozesstechnik an der TU Berlin. Bilingual study companion for TU Berlin's B.Sc. Energy and Process Engineering.",
  applicationName: "EPT-Kompass",
  keywords: [
    "TU Berlin",
    "Energie- und Prozesstechnik",
    "Thermodynamik",
    "Klausur",
    "bilingual",
    "Deutsch",
    "Studium",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e11" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tracks = await buildNavigation();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <SiteSidebar tracks={tracks} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
