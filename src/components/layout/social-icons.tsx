"use client";

import React from "react";
import { Facebook, Instagram, MessageCircle, Linkedin, LucideIcon } from "lucide-react";

interface SocialIconsProps {
  className?: string;
  iconSize?: number;
  iconColor?: string;
}

const SocialIcons: React.FC<SocialIconsProps> = ({
  className = "",
  iconSize = 20,
  iconColor = "currentColor"
}) => {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
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
  children
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden"
      aria-label={label}
    >
      <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center transition-all duration-300 group-hover:border-[#a5cd39] group-hover:bg-[#a5cd39] group-hover:scale-110 group-hover:shadow-[0_0_10px_rgba(165,205,57,0.5)] relative">
        {/* Ripple effect on hover */}
        <span className="absolute inset-0 rounded-full bg-[#a5cd39] opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-30 transition-all duration-700"></span>

        {/* Icon */}
        <div className="transition-all duration-300 group-hover:scale-110 relative z-10" style={{ color: iconColor }}>
          {React.cloneElement(children as React.ReactElement<React.ComponentProps<LucideIcon>>, {
            size: iconSize,
            className: "transition-all duration-300 group-hover:text-white group-hover:rotate-[360deg]"
          })}
        </div>
      </div>
    </a>
  );
};

export default SocialIcons;
