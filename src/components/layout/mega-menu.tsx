"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2
    }
  }
};

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-sm shadow-lg rounded-b-md py-4 border border-gray-100"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onMouseLeave={onClose}
        >
          <motion.div 
            className="px-4 py-2"
            variants={menuVariants}
          >
            <motion.h3 
              className="text-[#2C2C2C] font-semibold mb-4 text-sm border-b border-gray-100 pb-2"
              variants={itemVariants}
            >
              EXHIBITION STANDS
            </motion.h3>
            <motion.ul className="space-y-1">
              <MegaMenuItem href="/custom-stands" label="Custom Stands" />
              <MegaMenuItem href="/double-deck-stands" label="Double Deck Stands" />
              <MegaMenuItem href="/expo-pavilion-stands" label="Expo Pavilion Stands" />
            </motion.ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MegaMenuItem = ({ href, label }: { href: string; label: string }) => (
  <motion.li variants={itemVariants}>
    <Link
      href={href}
      className="block text-gray-700 hover:text-[#a5cd39] hover:bg-gray-50 px-3 py-2 rounded-md text-sm transition-all duration-200 relative group"
    >
      <span className="relative z-10 flex items-center">
        {label}
        <motion.span
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -4, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          →
        </motion.span>
      </span>
      <motion.div
        className="absolute inset-0 bg-gray-50 rounded-md"
        initial={false}
        animate={{ 
          scaleX: 0,
          originX: 0
        }}
        whileHover={{ 
          scaleX: 1,
          transition: { duration: 0.2 }
        }}
      />
    </Link>
  </motion.li>
);

export default MegaMenu;
