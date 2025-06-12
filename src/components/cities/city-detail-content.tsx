"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CityDetailContentProps {
    cityName: string;
    description: string;
}

const CityDetailContent = ({
    cityName,
    description,
}: CityDetailContentProps) => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6">
                            About Our {cityName} Operations
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            {description}
                        </p>
                    </motion.div>

                    {/* Services Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">
                                Our Services
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Custom Exhibition Stand Design</li>
                                <li>• Double Decker Exhibitions</li>
                                <li>• Country Pavilion Solutions</li>
                                <li>• Kiosk Design & Installation</li>
                                <li>• Conference & Event Management</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">
                                Why Choose Us
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Local expertise and knowledge</li>
                                <li>• International quality standards</li>
                                <li>• End-to-end project management</li>
                                <li>• Competitive pricing</li>
                                <li>• 24/7 support during events</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="bg-[#2C2C2C] text-white p-8 rounded-lg"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-center">
                            Get In Touch
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <Phone className="w-8 h-8 text-[#a5cd39] mx-auto mb-2" />
                                <p className="text-sm text-gray-300">Call Us</p>
                                <p className="font-medium">+971 554 974 645</p>
                            </div>
                            <div className="text-center">
                                <Mail className="w-8 h-8 text-[#a5cd39] mx-auto mb-2" />
                                <p className="text-sm text-gray-300">
                                    Email Us
                                </p>
                                <p className="font-medium">
                                    info@chronicles-dubai.com
                                </p>
                            </div>
                            <div className="text-center">
                                <Clock className="w-8 h-8 text-[#a5cd39] mx-auto mb-2" />
                                <p className="text-sm text-gray-300">
                                    Working Hours
                                </p>
                                <p className="font-medium">9 AM - 6 PM</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-8 py-3 text-sm font-bold uppercase tracking-wide rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-0">
                                Contact Our {cityName} Team
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CityDetailContent;
