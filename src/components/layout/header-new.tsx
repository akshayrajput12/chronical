"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { motion, AnimatePresence } from "framer-motion";

// Desktop Navigation Item
const NavItem = ({
  href,
  label,
  isActive,
  onClick
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      href={href}
      className={cn(
        "uppercase font-medium transition-colors py-2 px-1",
        isScrolled
          ? "text-[#2C2C2C] hover:text-[#a5cd39]"
          : "text-white hover:text-[#a5cd39]",
        isActive && "border-b-2 border-[#a5cd39]"
      )}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showExhibitionDropdown, setShowExhibitionDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle exhibition dropdown
  const toggleExhibitionDropdown = () => {
    setShowExhibitionDropdown(!showExhibitionDropdown);
  };
  
  // Toggle header visibility
  const toggleHeaderVisibility = () => {
    setIsHeaderVisible(!isHeaderVisible);
  };
  
  // Show header again when user scrolls to top
  useEffect(() => {
    if (window.scrollY < 50) {
      setIsHeaderVisible(true);
    }
  }, [isScrolled]);

  return (
    <>
      {/* Header */}
      <AnimatePresence>
        {isHeaderVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed top-0 left-0 w-full z-50 transition-all duration-300",
              isScrolled
                ? "bg-white shadow-md text-[#2C2C2C]"
                : "bg-transparent text-white"
            )}
          >
            {!isScrolled && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent pointer-events-none"></div>
            )}
            
            {/* Close button - only visible when scrolled */}
            {isScrolled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 right-3 z-50 bg-[#a5cd39] text-white rounded-full p-1 shadow-md lg:flex hidden items-center justify-center"
                onClick={toggleHeaderVisibility}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {/* Upper Header */}
            <div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center justify-between py-3">
                  {/* Left Logo */}
                  <div className="flex-shrink-0">
                    <Logo />
                  </div>

                  {/* Center Navigation: EXPO, CONGRESS, KIOSK */}
                  <div className="hidden lg:flex items-center space-x-6 ml-10">
                    <NavItem
                      href="/expo"
                      label="EXPO"
                      isActive={activeLink === "/expo"}
                      onClick={() => setActiveLink("/expo")}
                    />
                    <NavItem
                      href="/congress"
                      label="CONGRESS"
                      isActive={activeLink === "/congress"}
                      onClick={() => setActiveLink("/congress")}
                    />
                    <NavItem
                      href="/kiosk"
                      label="KIOSK"
                      isActive={activeLink === "/kiosk"}
                      onClick={() => setActiveLink("/kiosk")}
                    />
                  </div>

                  {/* Right Navigation */}
                  <div className="hidden lg:flex items-center space-x-5">
                    <NavItem
                      href="/about"
                      label="ABOUT US"
                      isActive={activeLink === "/about"}
                      onClick={() => setActiveLink("/about")}
                    />
                    <NavItem
                      href="/support"
                      label="SUPPORT"
                      isActive={activeLink === "/support"}
                      onClick={() => setActiveLink("/support")}
                    />
                    <NavItem
                      href="/blog"
                      label="BLOG"
                      isActive={activeLink === "/blog"}
                      onClick={() => setActiveLink("/blog")}
                    />
                    <NavItem
                      href="/contact"
                      label="CONTACT US"
                      isActive={activeLink === "/contact"}
                      onClick={() => setActiveLink("/contact")}
                    />
                    <div className="ml-2 px-3 py-1 border border-[#a5cd39] rounded">
                      <button className="text-[#a5cd39] uppercase font-medium flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WHATSAPP
                      </button>
                    </div>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    className="lg:hidden text-white"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Lower Header */}
            <div className="hidden lg:block">
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center justify-center py-2">
                  {/* Lower Desktop Navigation */}
                  <nav className="flex items-center space-x-6">
                    {/* Exhibition Stands with Dropdown */}
                    <div className="relative group">
                      <button
                        className={cn(
                          "uppercase font-medium transition-colors py-2 px-1",
                          isScrolled
                            ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                            : "text-white hover:text-[#a5cd39]",
                          activeLink === "/exhibition-stands" && "border-b-2 border-[#a5cd39]"
                        )}
                        onClick={() => {
                          toggleExhibitionDropdown();
                          setActiveLink("/exhibition-stands");
                        }}
                        onMouseEnter={() => setShowExhibitionDropdown(true)}
                        onMouseLeave={() => setShowExhibitionDropdown(false)}
                      >
                        EXHIBITION STANDS
                      </button>

                      {/* Exhibition Dropdown */}
                      <div
                        className={cn(
                          "absolute top-full left-0 mt-1 shadow-lg py-3 px-4 z-50 min-w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200",
                          isScrolled
                            ? "bg-white/95 backdrop-blur-sm"
                            : "bg-black/70 backdrop-blur-md",
                          showExhibitionDropdown && "opacity-100 visible"
                        )}
                        onMouseEnter={() => setShowExhibitionDropdown(true)}
                        onMouseLeave={() => setShowExhibitionDropdown(false)}
                      >
                        <div className="flex items-center whitespace-nowrap">
                          <Link
                            href="/custom-stands"
                            className={cn(
                              "transition-colors",
                              isScrolled
                                ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                                : "text-white hover:text-[#a5cd39]"
                            )}
                          >
                            CUSTOM STANDS
                          </Link>
                          <span className={cn("mx-2", isScrolled ? "text-gray-400" : "text-gray-500")}>—</span>
                          <Link
                            href="/double-deck-stands"
                            className={cn(
                              "transition-colors",
                              isScrolled
                                ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                                : "text-white hover:text-[#a5cd39]"
                            )}
                          >
                            DOUBLE DECK STANDS
                          </Link>
                          <span className={cn("mx-2", isScrolled ? "text-gray-400" : "text-gray-500")}>—</span>
                          <Link
                            href="/expo-pavilion-stands"
                            className={cn(
                              "transition-colors",
                              isScrolled
                                ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                                : "text-white hover:text-[#a5cd39]"
                            )}
                          >
                            EXPO PAVILION STANDS
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className={cn("self-center", isScrolled ? "text-gray-400" : "text-gray-500")}>|</div>

                    <NavItem
                      href="/trade-shows"
                      label="TOP TRADE SHOWS"
                      isActive={activeLink === "/trade-shows"}
                      onClick={() => setActiveLink("/trade-shows")}
                    />

                    <div className={cn("self-center", isScrolled ? "text-gray-400" : "text-gray-500")}>|</div>

                    <NavItem
                      href="/expo-locations"
                      label="TOP EXPO LOCATIONS"
                      isActive={activeLink === "/expo-locations"}
                      onClick={() => setActiveLink("/expo-locations")}
                    />

                    <div className={cn("self-center", isScrolled ? "text-gray-400" : "text-gray-500")}>|</div>

                    <NavItem
                      href="/portfolio"
                      label="PORTFOLIO"
                      isActive={activeLink === "/portfolio"}
                      onClick={() => setActiveLink("/portfolio")}
                    />
                  </nav>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Show header button when header is hidden */}
      <AnimatePresence>
        {!isHeaderVisible && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-[#a5cd39] text-white rounded-full p-2 shadow-lg"
            onClick={toggleHeaderVisibility}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Navigation - Slide from right */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Logo />
            <button
              className="text-[#2C2C2C]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sticky WhatsApp Button for Mobile */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button className="bg-[#a5cd39] text-white p-3 rounded-full shadow-lg">
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default Header;
