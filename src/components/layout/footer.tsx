"use client";

import React from "react";
import Link from "next/link";
import {
    Download,
    ChevronRight,
    MessageSquare,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialIcons from "./social-icons";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="bg-[#2C2C2C] text-white py-10">
            <div className="mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-13 gap-4 max-w-[1400px] mx-auto md:pr-0">
                    {/* Column 1: Services */}
                    <motion.div
                        className="px-2 md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-base w-max font-markazi font-semibold uppercase mb-3 relative flex items-center group">
                            <span className="relative z-10 w-max group-hover:text-[#a5cd39] transition-colors duration-300">
                                Services
                            </span>
                            <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-[#a5cd39] group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-1.5 text-sm">
                            <FooterLink
                                href="/expo-services"
                                label="Expo Services"
                            />
                            <FooterLink
                                href="/congress-services"
                                label="Congress Services"
                            />
                            <FooterLink
                                href="/kiosk-services"
                                label="Kiosk Services"
                            />
                            <FooterLink
                                href="/custom-stands"
                                label="Custom Stands"
                            />
                        </ul>
                    </motion.div>

                    {/* Column 2: Locations */}
                    <motion.div
                        className="px-2 md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-base w-max font-markazi font-semibold uppercase mb-3 relative flex items-center group">
                            <span className="relative z-10 w-max group-hover:text-[#a5cd39] transition-colors duration-300">
                                Locations
                            </span>
                            <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-[#a5cd39] group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-1.5 text-sm">
                            <FooterLink
                                href="/saudi-arabia"
                                label="Saudi Arabia"
                            />
                            <FooterLink href="/abu-dhabi" label="Abu Dhabi" />
                            <FooterLink href="/qatar" label="Qatar" />
                            <FooterLink href="/turkey" label="Turkey" />
                            <FooterLink href="/kuwait" label="Kuwait" />
                            <FooterLink href="/jordan" label="Jordan" />
                        </ul>
                    </motion.div>

                    {/* Column 3: Resources */}
                    <motion.div
                        className="px-2 md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-base font-markazi font-semibold w-max uppercase mb-3 relative flex items-center group">
                            <span className="relative z-10 w-max group-hover:text-[#a5cd39] transition-colors duration-300">
                                Resources
                            </span>
                            <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-[#a5cd39] group-hover:w-full transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-1.5 text-sm">
                            <FooterLink href="/about-us" label="About Us" />
                            <FooterLink href="/support" label="Support" />
                            <FooterLink href="/blog" label="Blog" />
                            <FooterLink href="/contact-us" label="Contact Us" />
                        </ul>
                    </motion.div>

                    {/* Column 4: Call Us */}
                    <motion.div
                        className="flex flex-col px-2 md:col-span-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="border border-gray-600 hover:border-[#a5cd39] rounded-md p-3 mb-3 text-center transition-all duration-300 hover:shadow-[0_0_10px_rgba(165,205,57,0.3)] group">
                            <h3 className="text-sm font-markazi font-medium mb-1.5 group-hover:text-[#a5cd39] transition-colors duration-300">
                                CALL US
                            </h3>
                            <a
                                href="tel:+971554974645"
                                className="text-center block text-[#a5cd39] text-sm font-medium hover:underline group-hover:scale-105 transition-transform duration-300"
                            >
                                +971 554 974 645
                            </a>
                        </div>

                        <div className="mb-3">
                            <Button
                                variant="outline"
                                className="border-gray-600 text-white hover:bg-[#a5cd39] hover:text-black hover:border-[#a5cd39] w-full h-9 text-sm transition-all duration-300 group relative overflow-hidden"
                            >
                                <span className="flex items-center text-black justify-center gap-1.5 relative z-10 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-black">
                                    <MessageSquare className="w-3.5  h-3.5 group-hover:animate-pulse group-hover:text-black" />
                                    CHAT WITH US
                                </span>
                                <span className="absolute inset-0 bg-[#a5cd39] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></span>
                            </Button>
                        </div>

                        <div className="flex justify-center">
                            <SocialIcons iconColor="#a5cd39" iconSize={16} />
                        </div>
                    </motion.div>

                    {/* Column 5: Download Profile */}
                    <motion.div
                        className="px-2 flex flex-col h-full md:col-span-4 md:pr-0"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="border border-gray-600 hover:border-[#a5cd39] rounded-md p-4 text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(165,205,57,0.3)] flex flex-col h-full justify-between mr-0">
                            <div>
                                <h3 className="text-sm mb-0.5 font-markazi font-medium">
                                    DOWNLOAD OUR
                                </h3>
                                <h3 className="text-lg font-rubik font-bold mb-3 text-[#a5cd39]">
                                    COMPANY PROFILE
                                </h3>
                                <p className="text-xs font-nunito text-gray-400 mb-4">
                                    Get detailed information about our services,
                                    portfolio, and expertise in exhibition stand
                                    design. Our company profile includes our
                                    history, mission, values, and showcase of
                                    our best work.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                className="border-[#a5cd39] bg-[#a5cd39] text-black hover:bg-transparent hover:text-[#a5cd39] w-full h-10 text-sm transition-all duration-300 group relative overflow-hidden"
                            >
                                <span className="flex items-center justify-center gap-1.5 relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                                    <Download className="w-3.5 h-3.5 transition-transform duration-300" />
                                    DOWNLOAD NOW
                                    <ArrowRight className="w-0 h-3.5 opacity-0 group-hover:w-3.5 group-hover:opacity-100 transition-all duration-300" />
                                </span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <li>
        <Link
            href={href}
            className="text-gray-300 hover:text-[#a5cd39] transition-colors flex items-center group"
        >
            <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#a5cd39] transform group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-nunito group-hover:translate-x-1 transition-transform duration-300">
                {label}
            </span>
        </Link>
    </li>
);

export default Footer;
