// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "NovaFusion | Real Estate Marketing Agency Ahmedabad",
    template: "%s | NovaFusion"
  },
  description: "Ahmedabad's premier real estate marketing agency. Drone videography, property photography, digital marketing for builders and developers in Gujarat.",
  keywords: [
    "real estate marketing ahmedabad",
    "drone shoot ahmedabad",
    "property photography ahmedabad",
    "real estate digital marketing",
    "builder marketing agency ahmedabad"
  ],
  authors: [{ name: "NovaFusion" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "NovaFusion",
    title: "NovaFusion | Real Estate Marketing Agency Ahmedabad",
    description: "Stunning drone videos, photography & digital marketing for real estate in Ahmedabad",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaFusion | Real Estate Marketing Agency Ahmedabad",
    description: "Real estate marketing solutions in Ahmedabad",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Ahmedabad" />
      </head>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
