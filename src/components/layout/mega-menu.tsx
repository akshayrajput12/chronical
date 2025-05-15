"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-md py-4 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2">
        <h3 className="text-[#2C2C2C] font-semibold mb-2 text-sm">EXHIBITION STANDS</h3>
        <ul className="space-y-2">
          <MegaMenuItem href="/custom-stands" label="Custom Stands" />
          <MegaMenuItem href="/double-deck-stands" label="Double Deck Stands" />
          <MegaMenuItem href="/expo-pavilion-stands" label="Expo Pavilion Stands" />
        </ul>
      </div>
    </div>
  );
};

const MegaMenuItem = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="block text-gray-700 hover:text-[#E04163] hover:bg-gray-50 px-2 py-1 rounded text-sm transition-colors"
    >
      {label}
    </Link>
  </li>
);

export default MegaMenu;
