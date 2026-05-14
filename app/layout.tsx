import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Explicit font-display for better performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://infortic.com'),
  title: {
    default: "Infortic - Temukan Peluang Terbaikmu",
    template: "%s | Infortic",
  },
  description: "Platform informasi kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia.",
  keywords: ["kompetisi", "beasiswa", "magang", "lomba", "scholarship", "internship", "mahasiswa", "pelajar", "Indonesia"],
  authors: [{ name: "Infortic" }],
  creator: "Infortic",
  publisher: "Infortic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://infortic.com",
    title: "Infortic - Temukan Peluang Terbaikmu",
    description: "Platform informasi kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia.",
    siteName: "Infortic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infortic - Temukan Peluang Terbaikmu",
    description: "Platform informasi kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification here
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to CDN for faster image loading */}
        <link rel="preconnect" href="https://infortic-images.gerrymoeis.workers.dev" />
        <link rel="dns-prefetch" href="https://infortic-images.gerrymoeis.workers.dev" />
        
        {/* Structured Data */}
        <OrganizationSchema
          name="Infortic"
          url="https://infortic.com"
          description="Platform informasi peluang kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia."
        />
        <WebSiteSchema
          name="Infortic"
          url="https://infortic.com"
          description="Platform informasi peluang kompetisi, beasiswa, magang, dan berbagai kesempatan lainnya untuk pelajar dan mahasiswa Indonesia."
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Skip to content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
