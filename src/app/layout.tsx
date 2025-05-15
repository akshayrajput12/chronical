import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/header-new";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chronicle Exhibits - Professional Exhibition Stand Builders",
  description: "Chronicle Exhibits specializes in custom exhibition stands, congress services, and expo solutions across the Middle East and beyond.",
  icons: {
    icon: "/icon.png",
    apple: { url: '/logo.png' },
    shortcut: { url: '/logo.png' }
  },
  metadataBase: new URL('https://chronicle-exhibits.com'),
  openGraph: {
    title: "Chronicle Exhibits - Professional Exhibition Stand Builders",
    description: "Chronicle Exhibits specializes in custom exhibition stands, congress services, and expo solutions across the Middle East and beyond.",
    images: ['/logo.png'],
    url: 'https://chronicle-exhibits.com',
    siteName: 'Chronicle Exhibits',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chronicle Exhibits - Professional Exhibition Stand Builders",
    description: "Chronicle Exhibits specializes in custom exhibition stands, congress services, and expo solutions across the Middle East and beyond.",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
