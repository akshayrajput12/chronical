"use client";

import React from "react";
import {
    Facebook,
    Instagram,
    MessageCircle,
    Linkedin,
    LucideIcon,
} from "lucide-react";

interface SocialIconsProps {
    className?: string;
    iconSize?: number;
    iconColor?: string;
}

const SocialIcons: React.FC<SocialIconsProps> = ({
    className = "",
    iconSize = 20,
    iconColor = "currentColor",
}) => {
    return (
        <div
            className={`flex items-center space-x-2 sm:space-x-3 md:space-x-4 ${className}`}
        >
            <SocialIcon
                href="https://facebook.com"
                label="Facebook"
                iconColor={iconColor}
                iconSize={iconSize}
            >
                <Facebook />
            </SocialIcon>

            <SocialIcon
                href="https://instagram.com"
                label="Instagram"
                iconColor={iconColor}
                iconSize={iconSize}
            >
                <Instagram />
            </SocialIcon>

            <SocialIcon
                href="https://linkedin.com"
                label="LinkedIn"
                iconColor={iconColor}
                iconSize={iconSize}
            >
                <Linkedin />
            </SocialIcon>

            <SocialIcon
                href="https://wa.me/971554974645"
                label="WhatsApp"
                iconColor={iconColor}
                iconSize={iconSize}
            >
                <MessageCircle />
            </SocialIcon>
        </div>
    );
};

interface SocialIconProps {
    href: string;
    label: string;
    iconColor: string;
    iconSize: number;
    children: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({
    href,
    label,
    iconColor,
    iconSize,
    children,
}) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label={label}
        >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-[#a5cd39] group-hover:bg-[#a5cd39]">
                {/* Icon */}
                <div className="relative z-10" style={{ color: iconColor }}>
                    {React.cloneElement(
                        children as React.ReactElement<
                            React.ComponentProps<LucideIcon>
                        >,
                        {
                            size: iconSize,
                            className: "group-hover:text-white",
                        },
                    )}
                </div>
            </div>
        </a>
    );
};

export default SocialIcons;
