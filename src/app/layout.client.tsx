"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/header-new";
import Footer from "@/components/layout/footer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if the current path is for admin, login, or signup pages
    const isAdminOrAuthPage =
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/signup");

    // Check if the current path is the home page
    const isHomePage = pathname === "/" || pathname === "/home";

    // Add/remove home-page class to body for typography targeting
    // Use requestAnimationFrame to avoid hydration mismatch
    useEffect(() => {
        const body = document.body;

        // Defer class modification to avoid hydration mismatch
        const timeoutId = setTimeout(() => {
            if (isHomePage) {
                body.classList.add("home-page");
            } else {
                body.classList.remove("home-page");
            }
        }, 0);

        // Cleanup function to remove class when component unmounts
        return () => {
            clearTimeout(timeoutId);
            body.classList.remove("home-page");
        };
    }, [isHomePage]);

    return (
        <>
            {/* Only show header on non-admin and non-auth pages */}
            {!isAdminOrAuthPage && <Header />}
            <div>{children}</div>
            {/* Only show footer on non-admin and non-auth pages */}
            {!isAdminOrAuthPage && <Footer />}
        </>
    );
}
