import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"]
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"]
});

const siteUrl = "https://allfinanz.mu";

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AllFinanz Consulting Ltd",
  url: siteUrl,
  telephone: "+230 2105209",
  description:
    "Chartered accountant-led accounting, tax, corporate finance, controls, and advisory support in Mauritius.",
  areaServed: {
    "@type": "Country",
    name: "Mauritius"
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "MU"
  },
  serviceType: [
    "Chartered accountant services",
    "Accounting and reporting",
    "Tax planning",
    "Corporate finance",
    "Corporate advisory"
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AllFinanz Consulting Ltd | Chartered Accountants in Mauritius",
  description:
    "Chartered accountant-led accounting, tax, corporate finance, controls, and strategy support for ambitious leadership in Mauritius.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "AllFinanz Consulting Ltd | Chartered Accountants in Mauritius",
    description:
      "Chartered accountant-led accounting, tax, corporate finance, controls, and strategy support for ambitious leadership in Mauritius.",
    url: siteUrl,
    siteName: "AllFinanz Consulting Ltd",
    locale: "en_MU",
    type: "website"
  },
  verification: {
    google: "google92545847441ab4ec.html"
  },
  icons: {
    icon: [
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favicon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/assets/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070809"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${jetBrains.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(professionalServiceSchema)
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
