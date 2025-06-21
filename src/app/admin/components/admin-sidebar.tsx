"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Info,
    Settings,
    Image as ImageIcon,
    FileText,
    ChevronDown,
    ChevronRight,
    Layout,
    Phone,
    Briefcase,
    Globe,
    LogOut,
    User,
    Calendar,
    Monitor,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/layout/logo";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface NavItemProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    hasChildren?: boolean;
    isOpen?: boolean;
    onClick?: () => void;
}

interface SubNavItemProps {
    href: string;
    label: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
    href,
    label,
    icon,
    isActive,
    hasChildren = false,
    isOpen = false,
    onClick,
}) => {
    return (
        <Link
            href={hasChildren ? "#" : href}
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
            }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {hasChildren && (
                <div>
                    {isOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </div>
            )}
        </Link>
    );
};

const SubNavItem: React.FC<SubNavItemProps> = ({ href, label, isActive }) => {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-2 pl-12 rounded-md transition-colors ${
                isActive
                    ? "bg-sidebar-accent/20 text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/10"
            }`}
        >
            <span className="text-sm">{label}</span>
        </Link>
    );
};

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        home: pathname.includes("/admin/pages/home"),
        about: pathname.includes("/admin/pages/about"),
        conference: pathname.includes("/admin/pages/conference"),
        kiosk: pathname.includes("/admin/pages/kiosk"),
    });

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (user && !error) {
                setUser(user);
                setIsSignedIn(true);
            }
        };

        fetchUser();
    }, [supabase.auth]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
            {/* Logo */}
            <div className="p-4 border-b border-sidebar-border flex justify-center">
                <Logo isScrolled={false} />
            </div>

            {/* User Profile */}
            {isSignedIn && user && (
                <div className="p-4 border-b border-sidebar-border">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-sidebar-accent/20 flex items-center justify-center">
                            <User
                                size={20}
                                className="text-sidebar-accent-foreground"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                Admin User
                            </p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">
                                {user.email || ""}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {/* Dashboard */}
                <NavItem
                    href="/admin"
                    label="Dashboard"
                    icon={<Home size={18} />}
                    isActive={pathname === "/admin"}
                />

                {/* Pages Section */}
                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                        Pages
                    </p>
                </div>

                {/* Home Page */}
                <div>
                    <NavItem
                        href="/admin/pages/home"
                        label="Home"
                        icon={<Layout size={18} />}
                        isActive={pathname.includes("/admin/pages/home")}
                        hasChildren={true}
                        isOpen={openSections.home}
                        onClick={() => toggleSection("home")}
                    />

                    <AnimatePresence>
                        {openSections.home && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-1 space-y-1">
                                    <SubNavItem
                                        href="/admin/pages/home/hero"
                                        label="Hero Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/hero"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/home/business"
                                        label="Business Hub"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/business"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/home/dynamic-cell"
                                        label="Dynamic Cell"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/dynamic-cell"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/home/why-section"
                                        label="Why Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/why-section"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/home/new-company"
                                        label="New Company"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/new-company"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/home/essential-support"
                                        label="Essential Support"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/essential-support"
                                        }
                                    />

                                    <SubNavItem
                                        href="/admin/pages/home/setup-process"
                                        label="Setup Process"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/home/setup-process"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/stats"
                                        label="Stats"
                                        isActive={
                                            pathname === "/admin/pages/stats"
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* About Page */}
                <div>
                    <NavItem
                        href="/admin/pages/about"
                        label="About"
                        icon={<Info size={18} />}
                        isActive={pathname.includes("/admin/pages/about")}
                        hasChildren={true}
                        isOpen={openSections.about}
                        onClick={() => toggleSection("about")}
                    />

                    <AnimatePresence>
                        {openSections.about && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-1 space-y-1">
                                    <SubNavItem
                                        href="/admin/pages/about/hero"
                                        label="Hero Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/about/hero"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/about/dedication"
                                        label="Dedication Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/about/dedication"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/about/main"
                                        label="About Us Main"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/about/main"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/about/description"
                                        label="About Description"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/about/description"
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Conference Page */}
                <div>
                    <NavItem
                        href="/admin/pages/conference"
                        label="Conference"
                        icon={<Calendar size={18} />}
                        isActive={pathname.includes("/admin/pages/conference")}
                        hasChildren={true}
                        isOpen={openSections.conference}
                        onClick={() => toggleSection("conference")}
                    />

                    <AnimatePresence>
                        {openSections.conference && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-1 space-y-1">
                                    <SubNavItem
                                        href="/admin/pages/conference/hero"
                                        label="Hero Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/hero"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/conference/event-management-services"
                                        label="Event Management Services"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/event-management-services"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/conference/conference-management-services"
                                        label="Conference Management Services"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/conference-management-services"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/conference/communicate-section"
                                        label="Communicate Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/communicate-section"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/conference/virtual-events-section"
                                        label="Virtual Events Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/virtual-events-section"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/conference/conference-solution-section"
                                        label="Conference Solution Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/conference/conference-solution-section"
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Kiosk Page */}
                <div>
                    <NavItem
                        href="/admin/pages/kiosk"
                        label="Kiosk"
                        icon={<Monitor size={18} />}
                        isActive={pathname.includes("/admin/pages/kiosk")}
                        hasChildren={true}
                        isOpen={openSections.kiosk}
                        onClick={() => toggleSection("kiosk")}
                    />

                    <AnimatePresence>
                        {openSections.kiosk && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-1 space-y-1">
                                    <SubNavItem
                                        href="/admin/pages/kiosk/hero"
                                        label="Hero Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/kiosk/hero"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/kiosk/content"
                                        label="Content Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/kiosk/content"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/kiosk/benefits"
                                        label="Benefits Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/kiosk/benefits"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/kiosk/manufacturers"
                                        label="Manufacturers Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/kiosk/manufacturers"
                                        }
                                    />
                                    <SubNavItem
                                        href="/admin/pages/kiosk/consultancy"
                                        label="Consultancy Section"
                                        isActive={
                                            pathname ===
                                            "/admin/pages/kiosk/consultancy"
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Other Pages */}
                <NavItem
                    href="/admin/pages/blog"
                    label="Blog"
                    icon={<FileText size={18} />}
                    isActive={pathname.includes("/admin/pages/blog")}
                />

                <NavItem
                    href="/admin/pages/contact"
                    label="Contact"
                    icon={<Phone size={18} />}
                    isActive={pathname.includes("/admin/pages/contact")}
                />

                <NavItem
                    href="/admin/pages/portfolio"
                    label="Portfolio"
                    icon={<Briefcase size={18} />}
                    isActive={pathname.includes("/admin/pages/portfolio")}
                />

                {/* Media & Settings */}
                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                        System
                    </p>
                </div>

                <NavItem
                    href="/admin/media"
                    label="Media Library"
                    icon={<ImageIcon size={18} />}
                    isActive={pathname.includes("/admin/media")}
                />

                <NavItem
                    href="/admin/settings"
                    label="Settings"
                    icon={<Settings size={18} />}
                    isActive={pathname.includes("/admin/settings")}
                />

                <NavItem
                    href="/admin/site-settings"
                    label="Site Settings"
                    icon={<Globe size={18} />}
                    isActive={pathname.includes("/admin/site-settings")}
                />

                {/* Logout */}
                <div className="pt-4 pb-2">
                    <p className="px-4 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                        Account
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/10"
                >
                    <div className="flex items-center gap-3">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </div>
                </button>
            </nav>
        </div>
    );
};

export default AdminSidebar;
