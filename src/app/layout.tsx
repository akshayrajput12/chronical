import type { Metadata } from "next";
import {
    Geist,
    Geist_Mono,
    Rubik,
    Nunito,
    Markazi_Text,
    Noto_Kufi_Arabic,
} from "next/font/google";
import "./globals.css";
import "./typography.css";

import { metadata as siteMetadata } from "./metadata";
import ClientLayout from "./layout.client";
import { MinimalLoadingProvider } from "@/components/providers/minimal-loading-provider";
import { InitialLoadingProvider } from "@/components/providers/initial-loading-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const rubik = Rubik({
    variable: "--font-rubik",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
});

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
});

const markaziText = Markazi_Text({
    variable: "--font-markazi-text",
    subsets: ["latin", "arabic"],
    weight: ["400", "500", "600", "700"],
});

const notoKufiArabic = Noto_Kufi_Arabic({
    variable: "--font-noto-kufi-arabic",
    subsets: ["latin", "arabic"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${nunito.variable} ${markaziText.variable} ${notoKufiArabic.variable} antialiased`}
            >
                {/* HTML loader that shows immediately before React loads */}
                <div
                    id="html-initial-loader"
                    className="initial-loading-screen"
                >
                    <div style={{ position: "relative" }}>
                        {/* Simple spinning ring */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "-16px",
                                width: "96px",
                                height: "96px",
                                border: "2px solid transparent",
                                borderTop: "2px solid #a5cd39",
                                borderRadius: "50%",
                                animation: "spin 2s linear infinite",
                            }}
                        ></div>

                        {/* Round logo container */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 10,
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                animation: "pulse 2s ease-in-out infinite",
                            }}
                        >
                            <img
                                src="/logo.png"
                                alt="Chronicle Exhibits"
                                style={{
                                    width: "48px",
                                    height: "auto",
                                    maxWidth: "48px",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* CSS animations for HTML loader */}
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                    `,
                    }}
                />
                <InitialLoadingProvider>
                    <MinimalLoadingProvider>
                        <ClientLayout>{children}</ClientLayout>
                    </MinimalLoadingProvider>
                </InitialLoadingProvider>
            </body>
        </html>
    );
}
