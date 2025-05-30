import type { Metadata } from "next";

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
