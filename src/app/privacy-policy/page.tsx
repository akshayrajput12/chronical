import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrivacyPolicyPageData } from "@/services/privacy-policy.service";
import PrivacyPolicyContent from "./components/privacy-policy-content";
import "./privacy-policy.css";

// Enable ISR - revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    try {
        const { metadata } = await getPrivacyPolicyPageData();

        return {
            title: metadata.title,
            description: metadata.description,
            keywords: metadata.keywords,
            openGraph: {
                title: metadata.ogTitle,
                description: metadata.ogDescription,
                images: metadata.ogImage ? [{ url: metadata.ogImage }] : [],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: metadata.ogTitle,
                description: metadata.ogDescription,
                images: metadata.ogImage ? [metadata.ogImage] : [],
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Privacy Policy - Chronicle Exhibits LLC",
            description: "Learn about how Chronicle Exhibits LLC protects your privacy and handles your personal information.",
        };
    }
}

const PrivacyPolicyPage = async () => {
    try {
        const { privacyPolicy } = await getPrivacyPolicyPageData();

        if (!privacyPolicy) {
            return notFound();
        }

        return (
            <div className="min-h-screen bg-white">
                {/* Privacy Policy Content */}
                <PrivacyPolicyContent privacyPolicy={privacyPolicy} />
            </div>
        );
    } catch (error) {
        console.error("Error loading privacy policy page:", error);
        return notFound();
    }
};

export default PrivacyPolicyPage;
