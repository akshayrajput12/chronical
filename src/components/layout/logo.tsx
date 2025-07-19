"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Logo = ({
    isScrolled,
    forceLight,
    isMobile,
    forceDark,
}: {
    isScrolled: boolean;
    forceLight?: boolean;
    isMobile?: boolean;
    forceDark?: boolean;
}) => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Determine which logo to show
    // For home page: use light logo when not scrolled, dark when scrolled
    // For other pages: always use dark logo unless forceLight is true
    // forceDark overrides other settings
    const shouldUseDarkLogo = forceDark
        ? true
        : forceLight
        ? false
        : isHomePage
        ? isScrolled
        : true;

    // Mobile-specific sizing
    const logoClasses = isMobile
        ? "max-h-[50px] w-auto" // Smaller size for mobile
        : "max-h-[70px] w-auto";

    const logoWidth = isMobile ? 100 : 130;
    const logoHeight = isMobile ? 60 : 80;

    return (
        <Link href="/" className="flex items-center">
            <Image
                src={shouldUseDarkLogo ? "/logo-dark.png" : "/logo.png"}
                alt="Chronicle Exhibits Logo"
                width={logoWidth}
                height={logoHeight}
                className={logoClasses}
                priority
            />
        </Link>
    );
};

export default Logo;
