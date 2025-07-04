"use client";

import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { motion, AnimatePresence } from "framer-motion";

// Create a context to share header state
const HeaderContext = createContext<{
    isScrolled: boolean;
}>({
    isScrolled: false,
});

const Header = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSubMenus, setMobileSubMenus] = useState<
        Record<string, boolean>
    >({});
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const lowerHeaderRef = useRef<HTMLDivElement>(null);

    // Check if current page is home page
    const isHomePage = pathname === "/";

    // Navigation mapping - determines which nav item should be active based on current pathname
    const getActiveNavigation = () => {
        // Left navigation (main tabs)
        if (pathname === "/conference")
            return { type: "main", key: "conference" };
        if (pathname === "/" || pathname === "/home")
            return { type: "main", key: "expo" };
        if (pathname === "/kiosk") return { type: "main", key: "kiosk" };

        // Right navigation items
        if (pathname === "/about") return { type: "right", key: "about" };
        if (pathname === "/support") return { type: "right", key: "support" };
        if (pathname === "/blog" || pathname.startsWith("/blog/"))
            return { type: "right", key: "blog" };
        if (pathname === "/cities" || pathname.startsWith("/cities/"))
            return { type: "right", key: "cities" };
        if (pathname === "/contact-us")
            return { type: "right", key: "contact" };

        // Sub-navigation items (should show expo as active main tab)
        if (
            pathname === "/visit-us" ||
            pathname === "/customexhibitionstands" ||
            pathname === "/doubledeckerexhibitionstands" ||
            pathname === "/countrypavilionexpoboothsolutions" ||
            pathname === "/whats-on" ||
            pathname.startsWith("/whats-on/") ||
            pathname === "/experience-dubai" ||
            pathname === "/portfolio"
        ) {
            return { type: "main", key: "expo" };
        }

        // Default to expo for home and unknown routes
        return { type: "main", key: "expo" };
    };

    const activeNavigation = getActiveNavigation();
    const activeSubMenu =
        activeNavigation.type === "main" ? activeNavigation.key : "expo";

    // Context value is provided directly to the provider

    // Handle scroll effect for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Check if lower header should be sticky
            if (lowerHeaderRef.current) {
                const sticky = lowerHeaderRef.current.offsetTop;

                if (window.scrollY > sticky + 20) {
                    lowerHeaderRef.current.style.position = "fixed";
                    lowerHeaderRef.current.style.top = "0";
                    lowerHeaderRef.current.style.left = "0";
                    lowerHeaderRef.current.style.zIndex = "40";
                    lowerHeaderRef.current.style.width = "100%";
                } else {
                    lowerHeaderRef.current.style.position = "absolute";
                    lowerHeaderRef.current.style.top = "auto";
                    lowerHeaderRef.current.style.left = "auto";
                    lowerHeaderRef.current.style.zIndex = "50";
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Check initial scroll position
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileMenuOpen) {
            setMobileSubMenus({}); // Reset submenus when closing main menu
        }
    };

    const toggleMobileSubMenu = (key: string) => {
        setMobileSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileSubMenus({});
    };

    // Toggle exhibition dropdown (not currently used)
    // const toggleExhibitionDropdown = () => {
    //   setShowExhibitionDropdown(!showExhibitionDropdown);
    // };

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

    // Header show button - only visible on mobile/tablet
    const HeaderShowButton = () => {
        if (!isHeaderVisible) {
            return (
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 right-4 z-50 bg-[#a5cd39] text-white rounded-full p-2 shadow-lg lg:hidden"
                    onClick={toggleHeaderVisibility}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Menu className="w-5 h-5" />
                </motion.button>
            );
        }
        return null;
    };

    return (
        <HeaderContext.Provider value={{ isScrolled }}>
            <AnimatePresence>
                {isHeaderVisible && (
                    <motion.header
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "w-full z-50 transition-all duration-300",
                            isScrolled
                                ? "bg-white shadow-md text-[#2C2C2C]"
                                : "bg-transparent text-white",
                        )}
                    >
                        {/* Close button - only visible on mobile/tablet when scrolled */}
                        {isScrolled && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-3 right-3 z-50 bg-[#a5cd39] text-white rounded-full p-1 shadow-md md:flex lg:hidden hidden items-center justify-center"
                                onClick={toggleHeaderVisibility}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        )}

                        {/* Upper Header */}
                        <div
                            className={cn(
                                "w-full transition-colors duration-300",
                                isScrolled ? "bg-white" : "bg-[#222222]",
                            )}
                        >
                            <div className="w-full px-4 sm:px-6 md:px-8 text-xs lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between py-0 relative">
                                {/* Left Main Navigation Tabs */}
                                <div className="hidden lg:flex items-center relative">
                                    <TabItem
                                        href="/conference"
                                        label="CONFERENCE"
                                        isActive={
                                            activeSubMenu === "conference"
                                        }
                                        className={cn(
                                            "bg-[#222222]",
                                            activeSubMenu !== "conference" &&
                                                "hover:bg-[#333333]",
                                        )}
                                        activeClassName="bg-[#a5cd39] text-white"
                                    />
                                    <TabItem
                                        href="/"
                                        label="EXPO BOOTH"
                                        isActive={activeSubMenu === "expo"}
                                        className={cn(
                                            "bg-[#222222]",
                                            activeSubMenu !== "expo" &&
                                                "hover:bg-[#333333]",
                                        )}
                                        activeClassName="bg-[#a5cd39] text-white"
                                    />

                                    <TabItem
                                        href="/kiosk"
                                        label="KIOSK"
                                        isActive={activeSubMenu === "kiosk"}
                                        className={cn(
                                            "bg-[#222222]",
                                            activeSubMenu !== "kiosk" &&
                                                "hover:bg-[#333333]",
                                        )}
                                        activeClassName="bg-[#a5cd39] text-white"
                                    />
                                </div>

                                {/* Right Navigation - Desktop Only */}
                                <div className="hidden lg:flex items-center justify-end flex-1 -mr-8 lg:-mr-12 xl:-mr-16 2xl:-mr-20 ml-16 lg:ml-24 xl:ml-32 2xl:ml-40">
                                    <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-3 xl:space-x-5">
                                        <NavItem
                                            href="/about"
                                            label="ABOUT US"
                                            isActive={
                                                activeNavigation.type ===
                                                    "right" &&
                                                activeNavigation.key === "about"
                                            }
                                        />
                                        <NavItem
                                            href="/portfolio"
                                            label="PORTFOLIO"
                                            isActive={
                                                activeNavigation.type ===
                                                    "right" &&
                                                activeNavigation.key ===
                                                    "portfolio"
                                            }
                                        />
                                        <NavItem
                                            href="/blog"
                                            label="BLOG"
                                            isActive={
                                                activeNavigation.type ===
                                                    "right" &&
                                                activeNavigation.key === "blog"
                                            }
                                        />
                                        <NavItem
                                            href="/contact-us"
                                            label="CONTACT US"
                                            isActive={
                                                activeNavigation.type ===
                                                    "right" &&
                                                activeNavigation.key ===
                                                    "contact"
                                            }
                                        />
                                    </div>
                                    {/* WhatsApp button - extends to screen edge */}
                                    <div className="ml-3 md:ml-4 lg:ml-6 xl:ml-8">
                                        <Link
                                            href="https://wa.me/yournumberhere"
                                            className="bg-transparent border border-[#a5cd39] text-[#a5cd39] hover:bg-[#a5cd39] hover:text-white transition-colors duration-300 rounded px-2 md:px-3 py-1.5 md:py-2 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm font-medium whitespace-nowrap"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 md:h-4 md:w-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                            </svg>
                                            <span className="hidden md:inline">
                                                WHATSAPP
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile/Tablet Menu Button */}
                                <div className="flex items-center justify-between w-full lg:hidden">
                                    <div
                                        className={cn(
                                            "px-4 md:px-6 py-3 md:py-4 flex-1 flex items-center justify-between transition-colors duration-300",
                                            isScrolled
                                                ? "bg-white"
                                                : "bg-[#222222]",
                                        )}
                                    >
                                        <Logo
                                            isScrolled={false}
                                            forceLight={true}
                                        />
                                        <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0">
                                            {/* Mobile/Tablet WhatsApp Button */}
                                            <Link
                                                href="https://wa.me/yournumberhere"
                                                className="bg-transparent border border-[#a5cd39] text-[#a5cd39] hover:bg-[#a5cd39] hover:text-white transition-colors duration-300 rounded px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 flex items-center space-x-1 sm:space-x-2 md:space-x-2 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                </svg>
                                                <span className="hidden sm:inline">
                                                    WHATSAPP
                                                </span>
                                            </Link>
                                            <button
                                                className={cn(
                                                    "p-1 md:p-2 transition-colors duration-300 lg:hidden",
                                                    isScrolled
                                                        ? "text-gray-800"
                                                        : "text-white",
                                                )}
                                                onClick={toggleMobileMenu}
                                                aria-label="Toggle menu"
                                            >
                                                {isMobileMenuOpen ? (
                                                    <X className="w-6 h-6 md:w-7 md:h-7" />
                                                ) : (
                                                    <Menu className="w-6 h-6 md:w-7 md:h-7" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Events Lower Header - Only visible when Events tab is active */}
                        {activeSubMenu && (
                            <div
                                ref={lowerHeaderRef}
                                className="w-full transition-all duration-300"
                            >
                                <div
                                    className={cn(
                                        "hidden relative py-3 lg:block transition-all duration-300 w-full",
                                        isHomePage
                                            ? isScrolled
                                                ? "bg-white shadow-md"
                                                : "bg-transparent"
                                            : "bg-white shadow-md",
                                    )}
                                >
                                    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
                                        <div className="flex flex-col">
                                            {/* Events Sub-Navigation */}
                                            <nav className="flex items-start w-full">
                                                <div className="flex-shrink-0 mr-8">
                                                    <Logo
                                                        isScrolled={isScrolled}
                                                    />
                                                </div>
                                                <div className="flex items-start justify-center flex-1">
                                                    <div className="flex items-center">
                                                        {/* Visit Us with Horizontal Dropdown */}
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/visit-us"
                                                                label="EXHIBITION STANDS"
                                                                subLabel="Bespoke designs, built to impress"
                                                                isActive={
                                                                    pathname ===
                                                                    "/visit-us"
                                                                }
                                                            />

                                                            {/* Horizontal Dropdown Menu - Only visible on hover */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-full w-[600px] py-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50",
                                                                    (isHomePage
                                                                        ? isScrolled
                                                                        : true) &&
                                                                        "bg-white shadow-md",
                                                                )}
                                                            >
                                                                <div className="flex space-x-8 px-4">
                                                                    <Link
                                                                        href="/customexhibitionstands"
                                                                        className={cn(
                                                                            "text-xs uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            (
                                                                                isHomePage
                                                                                    ? isScrolled
                                                                                    : true
                                                                            )
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        CUSTOM
                                                                        STANDS
                                                                    </Link>
                                                                    <Link
                                                                        href="/doubledeckerexhibitionstands"
                                                                        className={cn(
                                                                            "text-xs uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            (
                                                                                isHomePage
                                                                                    ? isScrolled
                                                                                    : true
                                                                            )
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        DOUBLE
                                                                        DECKER
                                                                        STANDS
                                                                    </Link>
                                                                    <Link
                                                                        href="/countrypavilionexpoboothsolutions"
                                                                        className={cn(
                                                                            "text-xs uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            (
                                                                                isHomePage
                                                                                    ? isScrolled
                                                                                    : true
                                                                            )
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        EXPO
                                                                        PAVILION
                                                                        STANDS
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "h-12 w-[1.5px] mx-4",
                                                                (
                                                                    isHomePage
                                                                        ? isScrolled
                                                                        : true
                                                                )
                                                                    ? "bg-white"
                                                                    : "bg-white",
                                                            )}
                                                        ></div>
                                                        <SubNavItem
                                                            href="/whats-on"
                                                            label="TOP EXHIBITIONS"
                                                            subLabel="Explore major upcoming exhibitions"
                                                            isActive={
                                                                pathname ===
                                                                    "/whats-on" ||
                                                                pathname.startsWith(
                                                                    "/whats-on/",
                                                                )
                                                            }
                                                        />
                                                        <div
                                                            className={cn(
                                                                "h-12 w-[1.5px] mx-4",
                                                                (
                                                                    isHomePage
                                                                        ? isScrolled
                                                                        : true
                                                                )
                                                                    ? "bg-white"
                                                                    : "bg-white",
                                                            )}
                                                        ></div>
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/cities"
                                                                label="TOP EXPO LOCATIONS"
                                                                subLabel="Premier venues across Dubai & the region"
                                                                isActive={
                                                                    pathname ===
                                                                    "/cities"
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile/Tablet Navigation - Slide from right */}
                        <div
                            className={cn(
                                "fixed top-0 right-0 h-full w-[280px] sm:w-[320px] md:w-[400px] lg:hidden bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
                                isMobileMenuOpen
                                    ? "translate-x-0"
                                    : "translate-x-full",
                            )}
                        >
                            <div className="h-full overflow-y-auto">
                                <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 bg-white">
                                    <Logo
                                        isScrolled={false}
                                        forceLight={true}
                                    />
                                    <button
                                        className="text-gray-800 p-1 md:p-2"
                                        onClick={closeMobileMenu}
                                        aria-label="Close menu"
                                    >
                                        <X className="w-6 h-6 md:w-7 md:h-7" />
                                    </button>
                                </div>

                                <div className="p-4 md:p-6">
                                    <nav className="flex flex-col">
                                        {/* Main Navigation Tabs */}
                                        <div className="flex flex-col space-y-3 md:space-y-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                                            <h3 className="text-[#a5cd39] uppercase text-sm md:text-base font-semibold mb-2 md:mb-3">
                                                Main Sections
                                            </h3>

                                            {/* Events with submenu */}
                                            <div className="relative">
                                                <button
                                                    className={cn(
                                                        "text-[#2C2C2C] uppercase font-medium w-full text-left py-2 md:py-3 text-sm md:text-base block",
                                                        mobileSubMenus[
                                                            "expo"
                                                        ] && "text-[#a5cd39]",
                                                    )}
                                                    onClick={() =>
                                                        toggleMobileSubMenu(
                                                            "expo",
                                                        )
                                                    }
                                                >
                                                    EXPO BOOTH
                                                </button>
                                                <AnimatePresence>
                                                    {mobileSubMenus["expo"] && (
                                                        <motion.div
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                height: "auto",
                                                                opacity: 1,
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                            }}
                                                            className="pl-4 mt-2 space-y-3 overflow-hidden"
                                                        >
                                                            <div className="relative">
                                                                <button
                                                                    className={cn(
                                                                        "text-[#2C2C2C] uppercase font-medium w-full text-left py-2 block",
                                                                        mobileSubMenus[
                                                                            "exhibition"
                                                                        ] &&
                                                                            "text-[#a5cd39]",
                                                                    )}
                                                                    onClick={() =>
                                                                        toggleMobileSubMenu(
                                                                            "exhibition",
                                                                        )
                                                                    }
                                                                >
                                                                    EXHIBITION
                                                                    STANDS
                                                                </button>
                                                                <AnimatePresence>
                                                                    {mobileSubMenus[
                                                                        "exhibition"
                                                                    ] && (
                                                                        <motion.div
                                                                            initial={{
                                                                                height: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                            animate={{
                                                                                height: "auto",
                                                                                opacity: 1,
                                                                            }}
                                                                            exit={{
                                                                                height: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                            className="pl-4 mt-2 space-y-2 overflow-hidden"
                                                                        >
                                                                            <MobileNavItem
                                                                                href="/customexhibitionstands"
                                                                                label="CUSTOM STANDS"
                                                                                isActive={
                                                                                    pathname ===
                                                                                    "/customexhibitionstands"
                                                                                }
                                                                                onClick={
                                                                                    closeMobileMenu
                                                                                }
                                                                            />
                                                                            <MobileNavItem
                                                                                href="/doubledeckerexhibitionstands"
                                                                                label="DOUBLE DECKER STANDS"
                                                                                isActive={
                                                                                    pathname ===
                                                                                    "/doubledeckerexhibitionstands"
                                                                                }
                                                                                onClick={
                                                                                    closeMobileMenu
                                                                                }
                                                                            />
                                                                            <MobileNavItem
                                                                                href="/countrypavilionexpoboothsolutions"
                                                                                label="EXPO PAVILION STANDS"
                                                                                isActive={
                                                                                    pathname ===
                                                                                    "/countrypavilionexpoboothsolutions"
                                                                                }
                                                                                onClick={
                                                                                    closeMobileMenu
                                                                                }
                                                                            />
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                            <MobileNavItem
                                                                href="/whats-on"
                                                                label="TOP EXHIBITIONS"
                                                                isActive={
                                                                    pathname ===
                                                                    "/whats-on"
                                                                }
                                                                onClick={
                                                                    closeMobileMenu
                                                                }
                                                            />
                                                            <MobileNavItem
                                                                href="/experience-dubai"
                                                                label="TOP EXPO LOCATIONS"
                                                                isActive={
                                                                    pathname ===
                                                                    "/experience-dubai"
                                                                }
                                                                onClick={
                                                                    closeMobileMenu
                                                                }
                                                            />
                                                            <MobileNavItem
                                                                href="/portfolio"
                                                                label="PORTFOLIO"
                                                                isActive={
                                                                    pathname ===
                                                                    "/portfolio"
                                                                }
                                                                onClick={
                                                                    closeMobileMenu
                                                                }
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <MobileNavItem
                                                href="/conference"
                                                label="CONFERENCE"
                                                isActive={
                                                    pathname === "/conference"
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/kiosk"
                                                label="KIOSK"
                                                isActive={pathname === "/kiosk"}
                                                onClick={closeMobileMenu}
                                            />
                                        </div>

                                        {/* Secondary Navigation */}
                                        <div className="flex flex-col space-y-3 md:space-y-4">
                                            <h3 className="text-[#a5cd39] uppercase text-sm md:text-base font-semibold mb-2 md:mb-3">
                                                Information
                                            </h3>

                                            <MobileNavItem
                                                href="/about"
                                                label="ABOUT US"
                                                isActive={pathname === "/about"}
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/portfolio"
                                                label="PORTFOLIO"
                                                isActive={
                                                    pathname === "/portfolio"
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/industry-insights"
                                                label="INDUSTRY INSIGHTS"
                                                isActive={
                                                    pathname ===
                                                    "/industry-insights"
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/blog"
                                                label="BLOG"
                                                isActive={
                                                    pathname === "/blog" ||
                                                    pathname.startsWith(
                                                        "/blog/",
                                                    )
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/cities"
                                                label="CITIES"
                                                isActive={
                                                    pathname === "/cities" ||
                                                    pathname.startsWith(
                                                        "/cities/",
                                                    )
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/contact-us"
                                                label="CONTACT US"
                                                isActive={
                                                    pathname === "/contact-us"
                                                }
                                                onClick={closeMobileMenu}
                                            />
                                            <MobileNavItem
                                                href="/ar"
                                                label="عربي"
                                                isActive={pathname === "/ar"}
                                                onClick={closeMobileMenu}
                                            />

                                            {/* WhatsApp Button in Mobile/Tablet Menu */}
                                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                                                <Link
                                                    href="https://wa.me/yournumberhere"
                                                    className="bg-[#a5cd39] text-white hover:bg-[#8fb82f] transition-colors duration-300 rounded px-4 md:px-6 py-3 md:py-4 flex items-center justify-center space-x-2 md:space-x-3 w-full"
                                                    onClick={closeMobileMenu}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 md:h-8 md:w-8"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                    </svg>
                                                    <span className="font-medium uppercase text-sm md:text-base">
                                                        Contact via WhatsApp
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Overlay when mobile menu is open */}
                        {isMobileMenuOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={closeMobileMenu}
                            />
                        )}

                        {/* Sticky Search Button for Mobile */}
                        <div className="lg:hidden fixed bottom-4 right-4 z-50">
                            <button className="bg-[#333333] text-white p-3 rounded-full shadow-lg">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>
            <HeaderShowButton />
        </HeaderContext.Provider>
    );
};

// Main Tab Item Component
const TabItem = ({
    href,
    label,
    isActive,
    className,
    activeClassName,
}: {
    href?: string;
    label: string;
    isActive?: boolean;
    className?: string;
    activeClassName?: string;
}) => {
    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "uppercase font-noto-kufi-arabic text-xs font-semibold transition-colors p-4 px-3 text-white tracking-wide",
                    className,
                    isActive && (activeClassName || className),
                )}
            >
                {label}
            </Link>
        );
    }

    return (
        <button
            className={cn(
                "uppercase font-noto-kufi-arabic font-semibold transition-colors py-3 px-6 text-white text-sm tracking-wide",
                className,
                isActive && (activeClassName || className),
            )}
        >
            {label}
        </button>
    );
};

// Desktop Navigation Item
const NavItem = ({
    href,
    label,
    isActive,
}: {
    href: string;
    label: string;
    isActive?: boolean;
}) => {
    const { isScrolled } = useContext(HeaderContext);

    return (
        <Link
            href={href}
            className={cn(
                "uppercase font-noto-kufi-arabic font-medium transition-colors px-2 xl:px-3 text-[11px] xl:text-[12px] whitespace-nowrap",
                isScrolled
                    ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                    : "text-white hover:text-[#a5cd39]",
                isActive && "text-[#a5cd39]",
            )}
        >
            {label}
        </Link>
    );
};

// Sub Navigation Item with Label and Description
const SubNavItem = ({
    href,
    label,
    subLabel,
    isActive,
}: {
    href: string;
    label: string;
    subLabel: string;
    isActive?: boolean;
}) => {
    const { isScrolled } = useContext(HeaderContext);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    // Determine if we should show dark text (white background)
    const shouldShowDarkText = isHomePage ? isScrolled : true;

    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col transition-colors text-center px-2",
                isActive
                    ? "text-[#a5cd39]"
                    : shouldShowDarkText
                    ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                    : "text-white hover:text-[#a5cd39]",
            )}
        >
            <span className="uppercase tracking-[1.25px] font-noto-kufi-arabic font-medium text-sm">
                {label}
            </span>
            <span
                className={cn(
                    "text-xs font-noto-kufi-arabic mt-1 max-w-[150px] text-center",
                    shouldShowDarkText ? "text-gray-500" : "text-white/80",
                )}
            >
                {subLabel}
            </span>
        </Link>
    );
};

// Mobile/Tablet Navigation Item
const MobileNavItem = ({
    href,
    label,
    isActive,
    onClick,
}: {
    href: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}) => (
    <Link
        href={href}
        className={cn(
            "text-[#2C2C2C] uppercase font-noto-kufi-arabic font-medium block py-2 md:py-3 text-sm md:text-base hover:text-[#a5cd39] transition-colors",
            isActive && "text-[#a5cd39]",
        )}
        onClick={onClick}
    >
        {label}
    </Link>
);

export default Header;
