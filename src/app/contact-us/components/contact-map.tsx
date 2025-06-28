"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ContactMap = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 !pb-0 bg-white">
            <div className="mx-auto">
                <div className="mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-full h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5139890547107!2d55.38061577600814!3d25.28692967765328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42e5a9ddaf97%3A0x563a582dbda7f14c!2sChronicle%20Exhibition%20Organizing%20L.L.C%20%7C%20Exhibition%20Stand%20Builder%20in%20Dubai%2C%20UAE%20-%20Middle%20East!5e0!3m2!1sen!2sin!4v1750325309116!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Dubai World Trade Centre Location"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactMap;
