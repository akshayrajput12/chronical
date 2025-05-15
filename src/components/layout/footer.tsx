"use client";

import React from "react";
import Link from "next/link";
import { Download, ChevronRight, Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialIcons from "./social-icons";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="bg-[#2C2C2C] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About Us */}
          <div className="space-y-6">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Chronicle Exhibits specializes in custom exhibition stands, congress services, and expo solutions across the Middle East and beyond.
            </p>
            <div className="pt-4">
              <SocialIcons iconColor="#a5cd39" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold uppercase mb-6 relative">
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#a5cd39]"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/expo-services" label="Expo Services" />
              <FooterLink href="/congress-services" label="Congress Services" />
              <FooterLink href="/kiosk-services" label="Kiosk Services" />
              <FooterLink href="/custom-stands" label="Custom Stands" />
              <FooterLink href="/double-deck-stands" label="Double Deck Stands" />
              <FooterLink href="/expo-pavilion-stands" label="Expo Pavilion Stands" />
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div>
            <h3 className="text-lg font-semibold uppercase mb-6 relative">
              <span className="relative z-10">Locations</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#a5cd39]"></span>
            </h3>
            <ul className="space-y-3 grid grid-cols-2 gap-x-4">
              <FooterLink href="/saudi-arabia" label="Saudi Arabia" />
              <FooterLink href="/abu-dhabi" label="Abu Dhabi" />
              <FooterLink href="/qatar" label="Qatar" />
              <FooterLink href="/turkey" label="Turkey" />
              <FooterLink href="/kuwait" label="Kuwait" />
              <FooterLink href="/jordan" label="Jordan" />
            </ul>
          </div>

          {/* Column 4: Contact & Profile */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold uppercase mb-6 relative">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#a5cd39]"></span>
            </h3>

            {/* Contact Info */}
            <div className="space-y-4">
              <ContactItem
                icon={<Phone className="w-5 h-5 text-[#a5cd39]" />}
                label="+971 554974645"
                href="tel:+971554974645"
              />
              <ContactItem
                icon={<Mail className="w-5 h-5 text-[#a5cd39]" />}
                label="info@chronicleexhibits.com"
                href="mailto:info@chronicleexhibits.com"
              />
              <ContactItem
                icon={<MapPin className="w-5 h-5 text-[#a5cd39]" />}
                label="Dubai, United Arab Emirates"
                href="#"
              />
            </div>

            {/* Download Profile */}
            <div className="mt-6">
              <Button
                variant="outline"
                className="group relative overflow-hidden border-[#a5cd39] text-black hover:text-white w-full justify-center py-6"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-[#a5cd39] group-hover:translate-x-0"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  DOWNLOAD COMPANY PROFILE
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* WhatsApp Button */}
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="group relative overflow-hidden border-[#a5cd39] text-black hover:text-white px-8 py-4"
          >
            <span className="absolute inset-0 w-0 bg-[#a5cd39] transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              CHAT WITH US ON WHATSAPP
            </span>
          </Button>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Chronicle Exhibits. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-[#a5cd39] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-[#a5cd39] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li className="group">
    <Link
      href={href}
      className="text-gray-300 hover:text-[#a5cd39] transition-all duration-300 flex items-center group-hover:translate-x-2"
    >
      <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#a5cd39]" />
      <span>{label}</span>
    </Link>
  </li>
);

const ContactItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <a
    href={href}
    className="flex items-center space-x-3 text-gray-300 hover:text-[#a5cd39] transition-all duration-300 group"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center group-hover:bg-[#a5cd39]/20 transition-all duration-300">
      {icon}
    </div>
    <span className="group-hover:translate-x-1 transition-transform duration-300">{label}</span>
  </a>
);

export default Footer;
