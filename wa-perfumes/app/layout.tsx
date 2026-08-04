import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Providers
import LenisProvider from "@/providers/LenisProvider";
import ThemeProvider from "@/providers/ThemeProvider";
// UI Components — client components imported directly
import Navigation from "@/components/ui/Navigation";
import CartSlider from "@/components/ui/CartSlider";
import DraggableFab from "@/components/ui/DraggableFab";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import PageTransition from "@/components/animations/PageTransition";
import ClientEffects from "@/components/effects/ClientEffects";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WA Perfumes | Ultra-Premium Luxury Fragrances",
    template: "%s | WA Perfumes",
  },
  description:
    "Experience the essence of excellence. WA Perfumes offers ultra-premium luxury fragrances — WA Signature for men, WA Elegance for women. Leave Your Signature.",
  keywords: [
    "luxury perfume",
    "premium fragrances",
    "WA Perfumes",
    "designer scents",
    "Morocco",
    "parfum de luxe",
  ],
  metadataBase: new URL("https://wa-parfun.vercel.app"),
  openGraph: {
    title: "WA Perfumes | Leave Your Signature",
    description: "Ultra-premium luxury fragrances inspired by the world's most iconic scents.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body
        className="antialiased min-h-screen overflow-x-hidden"
        style={{
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('wa-theme');
                  var theme = stored ? stored : null;
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <ClientEffects />
        <ThemeProvider>
          <LenisProvider>
            <AnnouncementBar />
            <Navigation />
            <CartSlider />
            <DraggableFab />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
          </LenisProvider>
        </ThemeProvider>


        {/* Film Grain Overlay — pure CSS, zero JS cost */}
        <div className="film-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
