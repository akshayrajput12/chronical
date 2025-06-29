"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Logo = ({
    isScrolled,
    forceLight,
}: {
    isScrolled: boolean;
    forceLight?: boolean;
}) => {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Determine which logo to show
    // For home page: use light logo when not scrolled, dark when scrolled
    // For other pages: always use dark logo unless forceLight is true
    const shouldUseDarkLogo = forceLight
        ? false
        : isHomePage
        ? isScrolled
        : true;

    return (
        <Link href="/" className="flex items-center">
            <Image
                src={shouldUseDarkLogo ? "/logo-dark.png" : "/logo.png"}
                alt="Chronicle Exhibits Logo"
                width={120}
                height={70}
                className="h-auto w-auto"
                style={{ minHeight: '70px' }}
                priority
            />
        </Link>
    );
};

export default Logo;
