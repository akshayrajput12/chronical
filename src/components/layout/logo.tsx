"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo.png"
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
