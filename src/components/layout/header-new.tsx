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
const HeaderContext = createContext<{ isScrolled: boolean }>({
    isScrolled: false,
});

const Header = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // const [showExhibitionDropdown, setShowExhibitionDropdown] = useState(false); // Not currently used
    const [activeLink, setActiveLink] = useState("");
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [showEventsSubMenu, setShowEventsSubMenu] = useState(true);
    const lowerHeaderRef = useRef<HTMLDivElement>(null);

    // Check if current page is portfolio page or blog detail page
    const isPortfolioPage = pathname?.startsWith("/portfolio");
    const isBlogDetailPage =
        pathname?.startsWith("/blog/") && pathname !== "/blog";
    const isSpecialPage = isPortfolioPage || isBlogDetailPage;

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
    };

    // Toggle exhibition dropdown (not currently used)
    // const toggleExhibitionDropdown = () => {
    //   setShowExhibitionDropdown(!showExhibitionDropdown);
    // };

    // Toggle events submenu
    const toggleEventsSubMenu = () => {
        setShowEventsSubMenu(!showEventsSubMenu);
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

    // Header show button
    const HeaderShowButton = () => {
        if (!isHeaderVisible) {
            return (
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
                            isScrolled || isSpecialPage
                                ? "bg-white shadow-md text-[#2C2C2C]"
                                : "bg-transparent text-white",
                        )}
                    >
                        {!isScrolled && !isSpecialPage && (
                            <div className="absolute inset-0 bg-black/10 to-transparent pointer-events-none z-[60]"></div>
                        )}
                        {/* Close button - only visible when scrolled or on special pages */}
                        {(isScrolled || isSpecialPage) && (
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
                        <div className="w-full bg-[#222222]">
                            <div className="container mx-auto max-w-[1240px] flex items-center justify-between py-0">
                                {/* Left Main Navigation Tabs */}
                                <div className="hidden lg:flex items-center">
                                    <TabItem
                                        href="/"
                                        label="EXPO"
                                        isActive={
                                            activeLink === "/events" ||
                                            showEventsSubMenu
                                        }
                                        onClick={() => {
                                            setActiveLink("/events");
                                            toggleEventsSubMenu();
                                        }}
                                        className="bg-[#222222] hover:bg-[#333333]"
                                        activeClassName="bg-[#a5cd39] text-white"
                                    />
                                    <TabItem
                                        href="/conference"
                                        label="CONFERENCE"
                                        isActive={activeLink === "/conference"}
                                        onClick={() => {
                                            setActiveLink("/conference");
                                            setShowEventsSubMenu(false);
                                        }}
                                        className="bg-[#222222] hover:bg-[#333333]"
                                        activeClassName="bg-[#a5cd39] text-white"
                                    />
                                    <TabItem
                                        href="/kiosk"
                                        label="KIOSK"
                                        isActive={activeLink === "/kiosk"}
                                        onClick={() => {
                                            setActiveLink("/kiosk");
                                            setShowEventsSubMenu(false);
                                        }}
                                        className="bg-[#222222] hover:bg-[#333333]"
                                        activeClassName="bg-[#a5cd39] text-white"
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
                                        href="/portfolio"
                                        label="PORTFOLIO"
                                        isActive={activeLink === "/portfolio"}
                                        onClick={() =>
                                            setActiveLink("/portfolio")
                                        }
                                    />
                                    <NavItem
                                        href="/support"
                                        label="SUPPORT"
                                        isActive={activeLink === "/support"}
                                        onClick={() =>
                                            setActiveLink("/support")
                                        }
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
                                        onClick={() =>
                                            setActiveLink("/contact")
                                        }
                                    />
                                    <Link
                                        href="https://wa.me/yournumberhere"
                                        className="bg-transparent border border-[#a5cd39] text-[#a5cd39] hover:bg-[#a5cd39] hover:text-white transition-colors duration-300 rounded px-4 py-2 flex items-center space-x-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            WHATSAPP
                                        </span>
                                    </Link>
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="flex items-center justify-between w-full lg:hidden">
                                    <div className="bg-[#222222] px-4 py-3 flex-1 flex items-center">
                                        <Logo isScrolled={isScrolled} />
                                        <button
                                            className="text-white ml-auto"
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
                        </div>

                        {/* Events Lower Header - Only visible when Events tab is active */}
                        {showEventsSubMenu && (
                            <div
                                ref={lowerHeaderRef}
                                className="w-full transition-all duration-300"
                            >
                                <div
                                    className={cn(
                                        "hidden relative py-3 lg:block transition-all duration-300 w-full",
                                        isScrolled || isSpecialPage
                                            ? "bg-white shadow-md"
                                            : "bg-transparent",
                                    )}
                                >
                                    <div className="container mx-auto px-4 relative z-10">
                                        <div className="flex flex-col">
                                            {/* Events Sub-Navigation */}
                                            <nav className="flex items-center w-full">
                                                <div className="flex-shrink-0 mr-8">
                                                    <Logo
                                                        isScrolled={
                                                            isScrolled ||
                                                            isSpecialPage
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between flex-1">
                                                    <div className="flex items-center">
                                                        {/* Visit Us with Horizontal Dropdown */}
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/visit-us"
                                                                label="VISIT US"
                                                                subLabel="Hotels, dining and amenities"
                                                                isActive={
                                                                    activeLink ===
                                                                    "/visit-us"
                                                                }
                                                                onClick={() =>
                                                                    setActiveLink(
                                                                        "/visit-us",
                                                                    )
                                                                }
                                                            />

                                                            {/* Horizontal Dropdown Menu - Only visible on hover */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-full w-[600px] py-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50",
                                                                    (isScrolled ||
                                                                        isSpecialPage) &&
                                                                        "bg-white shadow-md",
                                                                )}
                                                            >
                                                                <div className="flex space-x-8 px-4">
                                                                    <Link
                                                                        href="/restaurants-retail"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        RESTAURANTS
                                                                        AND
                                                                        RETAIL
                                                                    </Link>
                                                                    <Link
                                                                        href="/getting-here"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        GETTING
                                                                        HERE
                                                                    </Link>
                                                                    <Link
                                                                        href="/hotels"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        HOTELS
                                                                    </Link>
                                                                    <Link
                                                                        href="/neighbourhood-guide"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        NEIGHBOURHOOD
                                                                        GUIDE
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "h-12 w-px mx-4",
                                                                isScrolled ||
                                                                    isSpecialPage
                                                                    ? "bg-gray-300"
                                                                    : "bg-white/40",
                                                            )}
                                                        ></div>
                                                        <SubNavItem
                                                            href="/whats-on"
                                                            label="WHAT'S ON"
                                                            subLabel="Upcoming exhibitions and events"
                                                            isActive={
                                                                activeLink ===
                                                                "/whats-on"
                                                            }
                                                            onClick={() =>
                                                                setActiveLink(
                                                                    "/whats-on",
                                                                )
                                                            }
                                                        />
                                                        <div
                                                            className={cn(
                                                                "h-12 w-px mx-4",
                                                                isScrolled ||
                                                                    isSpecialPage
                                                                    ? "bg-gray-300"
                                                                    : "bg-white/40",
                                                            )}
                                                        ></div>
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/experience-dubai"
                                                                label="EXPERIENCE DUBAI"
                                                                subLabel="The best Dubai has to offer"
                                                                isActive={
                                                                    activeLink ===
                                                                    "/experience-dubai"
                                                                }
                                                                onClick={() =>
                                                                    setActiveLink(
                                                                        "/experience-dubai",
                                                                    )
                                                                }
                                                            />

                                                            {/* Horizontal Dropdown Menu - Only visible on hover */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-full w-[600px] py-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50",
                                                                    (isScrolled ||
                                                                        isSpecialPage) &&
                                                                        "bg-white shadow-md",
                                                                )}
                                                            >
                                                                <div className="flex space-x-8 px-4">
                                                                    <Link
                                                                        href="/plan-your-trip"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        PLAN
                                                                        YOUR
                                                                        TRIP
                                                                    </Link>
                                                                    <Link
                                                                        href="/experience-dubai"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        EXPERIENCE
                                                                        DUBAI
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "h-12 w-px mx-4",
                                                                isScrolled ||
                                                                    isSpecialPage
                                                                    ? "bg-gray-300"
                                                                    : "bg-white/40",
                                                            )}
                                                        ></div>
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/organise-event"
                                                                label="ORGANISE AN EVENT"
                                                                subLabel="Turnkey solutions for your events"
                                                                isActive={
                                                                    activeLink ===
                                                                    "/organise-event"
                                                                }
                                                                onClick={() =>
                                                                    setActiveLink(
                                                                        "/organise-event",
                                                                    )
                                                                }
                                                            />

                                                            {/* Horizontal Dropdown Menu - Only visible on hover */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-full w-[600px] py-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50",
                                                                    (isScrolled ||
                                                                        isSpecialPage) &&
                                                                        "bg-white shadow-md",
                                                                )}
                                                            >
                                                                <div className="flex space-x-8 px-4">
                                                                    <Link
                                                                        href="/venues"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        VENUES
                                                                    </Link>
                                                                    <Link
                                                                        href="/venue-services"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        VENUE
                                                                        SERVICES
                                                                    </Link>
                                                                    <Link
                                                                        href="/venue-explorer"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        VENUE
                                                                        EXPLORER
                                                                    </Link>
                                                                    <Link
                                                                        href="/event-enquiry"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        EVENT
                                                                        ENQUIRY
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "h-12 w-px mx-4",
                                                                isScrolled ||
                                                                    isSpecialPage
                                                                    ? "bg-gray-300"
                                                                    : "bg-white/40",
                                                            )}
                                                        ></div>
                                                        <div className="relative group">
                                                            <SubNavItem
                                                                href="/exhibit"
                                                                label="EXHIBIT AT AN EVENT"
                                                                subLabel="Be part of our leading events"
                                                                isActive={
                                                                    activeLink ===
                                                                    "/exhibit"
                                                                }
                                                                onClick={() =>
                                                                    setActiveLink(
                                                                        "/exhibit",
                                                                    )
                                                                }
                                                            />

                                                            {/* Vertical Dropdown Menu - Only visible on hover */}
                                                            <div
                                                                className={cn(
                                                                    "absolute left-0 top-full w-auto min-w-[300px] py-3 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50",
                                                                    (isScrolled ||
                                                                        isSpecialPage) &&
                                                                        "bg-white shadow-md",
                                                                )}
                                                            >
                                                                <div className="flex flex-col gap-y-1 px-4">
                                                                    <Link
                                                                        href="/customexhibitionstands"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2 whitespace-nowrap",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        CUSTOM
                                                                        EXHIBITION
                                                                        STANDS
                                                                    </Link>
                                                                    <Link
                                                                        href="/doubledeckerexhibitionstands"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2 whitespace-nowrap",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        DOUBLE
                                                                        DECKER
                                                                        EXHIBITION
                                                                        STANDS
                                                                    </Link>
                                                                    <Link
                                                                        href="/countrypavilionexpoboothsolutions"
                                                                        className={cn(
                                                                            "text-sm uppercase font-medium hover:text-[#a5cd39] transition-colors px-4 py-2 whitespace-nowrap",
                                                                            isScrolled ||
                                                                                isSpecialPage
                                                                                ? "text-gray-700"
                                                                                : "text-white",
                                                                        )}
                                                                    >
                                                                        COUNTRY
                                                                        PAVILION
                                                                        EXPO
                                                                        BOOTH
                                                                        SOLUTIONS
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "h-12 w-px mx-4",
                                                                isScrolled ||
                                                                    isSpecialPage
                                                                    ? "bg-gray-300"
                                                                    : "bg-white/40",
                                                            )}
                                                        ></div>
                                                        <SubNavItem
                                                            href="/contact-us"
                                                            label="CONTACT US"
                                                            subLabel="Get in touch with our team"
                                                            isActive={
                                                                activeLink ===
                                                                "/contact-us"
                                                            }
                                                            onClick={() =>
                                                                setActiveLink(
                                                                    "/contact-us",
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Navigation - Slide from right */}
                        <div
                            className={cn(
                                "fixed top-0 right-0 h-full w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
                                isMobileMenuOpen
                                    ? "translate-x-0"
                                    : "translate-x-full",
                            )}
                        >
                            <div className="h-full overflow-y-auto">
                                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#222222]">
                                    <Logo
                                        isScrolled={isScrolled || isSpecialPage}
                                    />
                                    <button
                                        className="text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        aria-label="Close menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <nav className="flex flex-col">
                                        {/* Main Navigation Tabs */}
                                        <div className="flex flex-col space-y-3 mb-4 pb-4 border-b border-gray-200">
                                            <h3 className="text-[#a5cd39] uppercase text-sm font-semibold mb-2">
                                                Main Sections
                                            </h3>

                                            {/* Events with submenu */}
                                            <div className="relative">
                                                <Link
                                                    href="/"
                                                    className={cn(
                                                        "text-[#2C2C2C] uppercase font-medium w-full text-left py-2 block",
                                                        activeLink ===
                                                            "/events" &&
                                                            "text-[#a5cd39]",
                                                    )}
                                                    onClick={() => {
                                                        toggleEventsSubMenu();
                                                        setActiveLink(
                                                            "/events",
                                                        );
                                                    }}
                                                >
                                                    EXPO
                                                </Link>
                                                {showEventsSubMenu && (
                                                    <div className="pl-4 mt-2 space-y-3">
                                                        <MobileNavItem
                                                            href="/visit-us"
                                                            label="VISIT US"
                                                            isActive={
                                                                activeLink ===
                                                                "/visit-us"
                                                            }
                                                            onClick={() => {
                                                                setActiveLink(
                                                                    "/visit-us",
                                                                );
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        />
                                                        <MobileNavItem
                                                            href="/whats-on"
                                                            label="WHAT'S ON"
                                                            isActive={
                                                                activeLink ===
                                                                "/whats-on"
                                                            }
                                                            onClick={() => {
                                                                setActiveLink(
                                                                    "/whats-on",
                                                                );
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        />
                                                        <MobileNavItem
                                                            href="/experience-dubai"
                                                            label="EXPERIENCE DUBAI"
                                                            isActive={
                                                                activeLink ===
                                                                "/experience-dubai"
                                                            }
                                                            onClick={() => {
                                                                setActiveLink(
                                                                    "/experience-dubai",
                                                                );
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        />
                                                        <MobileNavItem
                                                            href="/organise-event"
                                                            label="ORGANISE AN EVENT"
                                                            isActive={
                                                                activeLink ===
                                                                "/organise-event"
                                                            }
                                                            onClick={() => {
                                                                setActiveLink(
                                                                    "/organise-event",
                                                                );
                                                                setIsMobileMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        />
                                                        <div>
                                                            <MobileNavItem
                                                                href="/exhibit"
                                                                label="EXHIBIT AT AN EVENT"
                                                                isActive={
                                                                    activeLink ===
                                                                    "/exhibit"
                                                                }
                                                                onClick={() => {
                                                                    setActiveLink(
                                                                        "/exhibit",
                                                                    );
                                                                    setIsMobileMenuOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                            />
                                                            <div className="pl-4 mt-2 space-y-2">
                                                                <MobileNavItem
                                                                    href="/customexhibitionstands"
                                                                    label="CUSTOM EXHIBITION STANDS"
                                                                    isActive={
                                                                        activeLink ===
                                                                        "/customexhibitionstands"
                                                                    }
                                                                    onClick={() => {
                                                                        setActiveLink(
                                                                            "/customexhibitionstands",
                                                                        );
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                />
                                                                <MobileNavItem
                                                                    href="/doubledeckerexhibitionstands"
                                                                    label="DOUBLE DECKER EXHIBITION STANDS"
                                                                    isActive={
                                                                        activeLink ===
                                                                        "/doubledeckerexhibitionstands"
                                                                    }
                                                                    onClick={() => {
                                                                        setActiveLink(
                                                                            "/doubledeckerexhibitionstands",
                                                                        );
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                />
                                                                <MobileNavItem
                                                                    href="/countrypavilionexpoboothsolutions"
                                                                    label="COUNTRY PAVILION EXPO BOOTH SOLUTIONS"
                                                                    isActive={
                                                                        activeLink ===
                                                                        "/countrypavilionexpoboothsolutions"
                                                                    }
                                                                    onClick={() => {
                                                                        setActiveLink(
                                                                            "/countrypavilionexpoboothsolutions",
                                                                        );
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <MobileNavItem
                                                href="/conference"
                                                label="CONFERENCE"
                                                isActive={
                                                    activeLink === "/conference"
                                                }
                                                onClick={() => {
                                                    setActiveLink(
                                                        "/conference",
                                                    );
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/kiosk"
                                                label="KIOSK"
                                                isActive={
                                                    activeLink === "/kiosk"
                                                }
                                                onClick={() => {
                                                    setActiveLink("/kiosk");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                        </div>

                                        {/* Secondary Navigation */}
                                        <div className="flex flex-col space-y-3">
                                            <h3 className="text-[#a5cd39] uppercase text-sm font-semibold mb-2">
                                                Information
                                            </h3>

                                            <MobileNavItem
                                                href="/about"
                                                label="ABOUT US"
                                                isActive={
                                                    activeLink === "/about"
                                                }
                                                onClick={() => {
                                                    setActiveLink("/about");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/portfolio"
                                                label="PORTFOLIO"
                                                isActive={
                                                    activeLink === "/portfolio"
                                                }
                                                onClick={() => {
                                                    setActiveLink("/portfolio");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/industry-insights"
                                                label="INDUSTRY INSIGHTS"
                                                isActive={
                                                    activeLink ===
                                                    "/industry-insights"
                                                }
                                                onClick={() => {
                                                    setActiveLink(
                                                        "/industry-insights",
                                                    );
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/blog"
                                                label="BLOG"
                                                isActive={
                                                    activeLink === "/blog"
                                                }
                                                onClick={() => {
                                                    setActiveLink("/blog");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/contact-us"
                                                label="CONTACT US"
                                                isActive={
                                                    activeLink === "/contact-us"
                                                }
                                                onClick={() => {
                                                    setActiveLink(
                                                        "/contact-us",
                                                    );
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                            <MobileNavItem
                                                href="/ar"
                                                label="عربي"
                                                isActive={activeLink === "/ar"}
                                                onClick={() => {
                                                    setActiveLink("/ar");
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            />
                                        </div>
                                    </nav>
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
    onClick,
    className,
    activeClassName,
}: {
    href?: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    activeClassName?: string;
}) => {
    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "uppercase font-semibold transition-colors py-3 px-6 text-white text-sm tracking-wide",
                    className,
                    isActive && (activeClassName || className),
                )}
                onClick={onClick}
            >
                {label}
            </Link>
        );
    }

    return (
        <button
            className={cn(
                "uppercase font-semibold transition-colors py-3 px-6 text-white text-sm tracking-wide",
                className,
                isActive && (activeClassName || className),
            )}
            onClick={onClick}
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
    onClick,
}: {
    href: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}) => {
    return (
        <Link
            href={href}
            className={cn(
                "uppercase font-light transition-colors py-6 px-3 text-[12px]",
                "text-white hover:text-[#a5cd39]",
                isActive && "text-[#a5cd39]",
            )}
            onClick={onClick}
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
    onClick,
}: {
    href: string;
    label: string;
    subLabel: string;
    isActive?: boolean;
    onClick?: () => void;
}) => {
    const { isScrolled } = useContext(HeaderContext);
    const pathname = usePathname();
    const isPortfolioPage = pathname?.startsWith("/portfolio");
    const isBlogDetailPage =
        pathname?.startsWith("/blog/") && pathname !== "/blog";
    const isSpecialPage = isPortfolioPage || isBlogDetailPage;

    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col transition-colors text-center px-2",
                isActive
                    ? "text-[#a5cd39]"
                    : isScrolled || isSpecialPage
                    ? "text-[#2C2C2C] hover:text-[#a5cd39]"
                    : "text-white hover:text-[#a5cd39]",
            )}
            onClick={onClick}
        >
            <span className="uppercase font-medium text-sm">{label}</span>
            <span
                className={cn(
                    "text-xs mt-1 max-w-[150px] text-center",
                    isScrolled || isSpecialPage
                        ? "text-gray-500"
                        : "text-white/80",
                )}
            >
                {subLabel}
            </span>
        </Link>
    );
};

// Mobile Navigation Item
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
            "text-[#2C2C2C] uppercase font-medium block py-2 hover:text-[#a5cd39] transition-colors",
            isActive && "text-[#a5cd39]",
        )}
        onClick={onClick}
    >
        {label}
    </Link>
);

export default Header;
