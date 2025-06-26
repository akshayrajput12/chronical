"use client";

import React from "react";
import {
    AnimationGeneratorType,
    Easing,
    motion,
    Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const PromoteBrandSection = () => {
    const buttonVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as Easing | Easing[] | undefined,
                delay: 0.2,
            },
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#8aaa30",
            boxShadow: "0px 5px 15px rgba(165,205,57,0.4)",
            transition: {
                duration: 0.3,
                type: "spring" as AnimationGeneratorType | undefined,
                stiffness: 300,
            },
        },
    };
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left Content */}
                        <motion.div
                            className="order-2 lg:order-1"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide text-center">
                                    PROMOTE YOUR BRAND AND SERVICES
                                </h3>

                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        Participating in a trade show is an
                                        appreciable approach to promoting your
                                        product & services. These events are a
                                        superb platform to make new clients,
                                        establish long-term business networks &
                                        study consumer behavior. Leading and
                                        skillful brands go for custom exhibition
                                        stands to step up their business & catch
                                        the eye of the visitors on the show
                                        floor.
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        A custom-built{" "}
                                        <span className="text-[#a5cd39] font-medium">
                                            exhibition stands design in Dubai
                                        </span>{" "}
                                        is specifically crafted around your
                                        business aspirations & goals. Every
                                        element of these stands is manufactured
                                        to upgrade your brand image & meet your
                                        specific business requirements. These
                                        stands help you achieve your objectives
                                        and catch the convinced attention of the
                                        visitors.
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        A custom exhibition booth makes you look
                                        different from other exhibitors & passes
                                        on the relevant brand message to the
                                        clients.
                                    </p>
                                    <Link href={"#"}>
                                        <motion.button
                                            className="bg-[#a5cd39] font-noto-kufi-arabic text-sm leading-[24px] text-white py-3 px-8 rounded-md font-medium"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                        >
                                            Request Quotation
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image with Colored Background */}
                        <motion.div
                            className="order-1 lg:order-2 relative"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* Image Container */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1559223607-b4d0555ae227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Promote your brand exhibition stand"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoteBrandSection;
