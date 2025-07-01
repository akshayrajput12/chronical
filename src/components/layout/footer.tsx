"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, ChevronRight, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialIcons from "./social-icons";
import { useCities } from "@/hooks/use-cities";

const Footer = () => {
    // Fetch cities for dynamic locations
    const { cities, isLoading } = useCities({ limit: 10, is_active: true });

    return (
        <footer className="bg-[#2C2C2C] text-white relative">
            <div className="flex flex-col lg:flex-row">
                {/* Left Section - Dark Background */}
                <div className="flex-1 px-4 md:px-8 py-6 md:py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
                        {/* Column 1: Services */}
                        <div>
                            <h3 className="font-markazi font-semibold uppercase mb-3 text-white text-base">
                                SERVICES
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
                        </div>

                        {/* Column 2: Locations - Dynamic */}
                        <div>
                            <h3 className="font-markazi font-semibold uppercase mb-3 text-white text-base">
                                LOCATIONS
                            </h3>
                            <ul className="space-y-1.5 text-sm">
                                {isLoading ? (
                                    // Loading state
                                    <>
                                        <li className="text-gray-400 text-sm">
                                            Loading locations...
                                        </li>
                                    </>
                                ) : cities.length > 0 ? (
                                    // Dynamic cities from database
                                    <>
                                        {cities.slice(0, 6).map(city => (
                                            <FooterLink
                                                key={city.id}
                                                href={`/cities/${city.slug}`}
                                                label={city.name}
                                            />
                                        ))}
                                        {cities.length > 6 && (
                                            <FooterLink
                                                href="/cities"
                                                label="View All Locations"
                                            />
                                        )}
                                    </>
                                ) : (
                                    // Fallback if no cities
                                    <li className="text-gray-400 text-sm">
                                        No locations available
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Column 3: Resources */}
                        <div>
                            <h3 className="font-markazi font-semibold uppercase mb-3 text-white text-base">
                                RESOURCES
                            </h3>
                            <ul className="space-y-1.5 text-sm">
                                <FooterLink href="/about-us" label="About Us" />
                                <FooterLink href="/blog" label="Blog" />
                                <FooterLink
                                    href="/contact-us"
                                    label="Contact Us"
                                />
                            </ul>
                        </div>

                        {/* Column 4: Call Us */}
                        <div className="flex flex-col">
                            <div className="border border-gray-600 rounded-md p-3 mb-3 text-center">
                                <h3 className="font-markazi font-semibold uppercase mb-1.5 text-white text-base">
                                    CALL US
                                </h3>
                                <a
                                    href="tel:+971543474645"
                                    className="text-[#a5cd39] text-base font-medium hover:underline"
                                >
                                    +971 54 347 4645
                                </a>
                            </div>

                            <Button
                                variant="outline"
                                className="border-gray-600 text-black hover:bg-[#a5cd39] hover:text-black hover:border-[#a5cd39] w-full h-10 text-sm transition-all duration-300 mb-3"
                            >
                                <MessageSquare className="w-4 h-4 mr-2 text-black" />
                                CHAT WITH US
                            </Button>

                            <div className="flex justify-center space-x-3">
                                <SocialIcons
                                    iconColor="#a5cd39"
                                    iconSize={20}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Green Background */}
                <div className="w-full lg:w-[450px] bg-[#a5cd39] px-4 md:px-8 py-6 md:py-8 flex flex-col justify-center">
                    <div className="text-center">
                        <h3 className="font-markazi font-semibold uppercase mb-1 text-white text-base">
                            DOWNLOAD OUR
                        </h3>
                        <h3 className="text-lg font-rubik font-bold mb-3 text-white">
                            COMPANY PROFILE
                        </h3>
                        <p className="text-sm font-noto-kufi-arabic text-white/90 mb-4 leading-relaxed">
                            Get detailed information about our services,
                            portfolio, and expertise in exhibition stand design.
                            Our company profile includes our history, mission,
                            values, and showcase of our best work.
                        </p>

                        <Button
                            variant="outline"
                            className="border-white bg-white text-[#a5cd39] hover:bg-transparent hover:text-white hover:border-white w-full h-10 text-sm transition-all duration-300 font-medium"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            DOWNLOAD NOW
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
    <li>
        <Link
            href={href}
            className="text-gray-300 hover:text-[#a5cd39] transition-colors flex items-center group text-sm"
        >
            <ChevronRight className="w-3 h-3 mr-2 text-[#a5cd39] transform group-hover:translate-x-1 transition-transform duration-300" />
            <span className="font-noto-kufi-arabic group-hover:translate-x-1 transition-transform duration-300">
                {label}
            </span>
        </Link>
    </li>
);

export default Footer;
