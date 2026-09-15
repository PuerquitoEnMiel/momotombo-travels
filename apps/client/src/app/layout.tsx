import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider, Toaster } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://momotombo.travel";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Momotombo Travels | Premium Nicaragua",
    template: "%s | Momotombo Travels",
  },
  description: "Descubre la tierra de lagos y volcanes con inteligencia artificial y un diseño premium. Itinerarios personalizados, reservas y guías locales en Nicaragua.",
  applicationName: "Momotombo Travels",
  keywords: ["Nicaragua", "viajes", "turismo", "itinerarios", "IA", "vacaciones", "Centroamérica", "Ometepe", "Granada", "León"],
  authors: [{ name: "Momotombo Travels" }],
  creator: "Momotombo Travels",
  publisher: "Momotombo Travels",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "Momotombo Travels",
    title: "Momotombo Travels | Premium Nicaragua",
    description: "Descubre la tierra de lagos y volcanes con inteligencia artificial.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Momotombo Travels - Nicaragua con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Momotombo Travels | Premium Nicaragua",
    description: "Descubre la tierra de lagos y volcanes con inteligencia artificial.",
    images: ["/og-image.svg"],
    creator: "@momotombotravel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
    },
  },
  category: "travel",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <I18nProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-2000 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md"
          >
            Saltar al contenido principal
          </a>
          <Navbar />
          <div id="main-content" className="min-h-screen">
            {children}
          </div>
          <Footer />
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
