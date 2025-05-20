"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = ({ isScrolled }: { isScrolled: boolean }) => {
    return (
        <Link href="/" className="flex items-center">
            <Image
                src={!isScrolled ? "/logo.png" : "/logo-dark.png"}
                alt="Chronicle Exhibits Logo"
                width={150}
                height={50}
                className="h-auto w-auto"
                priority
            />
        </Link>
    );
};

export default Logo;
