import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Providers
import LenisProvider from "@/providers/LenisProvider";
import ThemeProvider from "@/providers/ThemeProvider";
// UI Components — client components imported directly
import Navigation from "@/components/ui/Navigation";
import CartSlider from "@/components/ui/CartSlider";
import WhatsAppDrawer from "@/components/ui/WhatsAppDrawer";
import DraggableFab from "@/components/ui/DraggableFab";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import PageTransition from "@/components/animations/PageTransition";

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
    default: "WA Perfumes | Parfums de Luxe Inspirés",
    template: "%s | WA Perfumes",
  },
  description:
    "Découvrez l'essence de l'excellence. WA Perfumes propose des parfums de luxe ultra-premium — WA Signature pour homme, WA Elegance pour femme. Laissez Votre Signature.",
  keywords: [
    "parfum de luxe",
    "parfums premium",
    "WA Perfumes",
    "parfums inspirés",
    "Maroc",
  ],
  metadataBase: new URL("https://waperfumes.ma"),
  openGraph: {
    title: "WA Perfumes | Laissez Votre Signature",
    description: "Parfums de luxe ultra-premium inspirés par les fragrances les plus iconiques au monde.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0E0A10" },
    { media: "(prefers-color-scheme: light)", color: "#FAF5F0" },
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
      lang="fr"
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
        <ThemeProvider>
          <LenisProvider>
            <AnnouncementBar />
            <Navigation />
            <CartSlider />
            <WhatsAppDrawer />
            <DraggableFab />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
