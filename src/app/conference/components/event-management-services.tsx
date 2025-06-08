"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const EventManagementServices = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Top Section - EVENT MANAGEMENT SERVICES IN DUBAI, UAE */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 uppercase tracking-wide">
                            EVENT MANAGEMENT SERVICES IN DUBAI, UAE
                        </h2>
                        <p className="text-base text-gray-700 leading-relaxed text-justify max-w-4xl mx-auto">
                            We are{" "}
                            <strong>
                                licensed & skillful meeting & conference
                                organizers in Dubai
                            </strong>
                            , creating unforgettable experiences through our{" "}
                            <strong>calculated planning services</strong>. We
                            plan all sorts of events in every city across the
                            nation.
                        </p>
                    </motion.div>

                    {/* Bottom Section - Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
                                    WIDE-SPECTRUM MEETING MANAGEMENT &
                                    CONFERENCE SERVICES
                                </h3>

                                <div className="space-y-4 text-gray-700">
                                    <p className="text-base leading-relaxed text-justify">
                                        Being one of the leading Conference
                                        Organizing Companies in Dubai, we
                                        provide you with an effective plan of
                                        action after an in-depth analysis of
                                        your event needs & objectives. With
                                        years of experience as an event
                                        management and conference organizer, we
                                        plan your zero-sum corporate meetings
                                        attentively, ensuring you higher
                                        accuracy.
                                    </p>

                                    <p className="text-base leading-relaxed text-justify">
                                        We offer a full-scale range of event
                                        management services covering every
                                        aspect of your event from planning to
                                        execution. We believe in providing
                                        prompt & high-quality conference
                                        organizing & management services.
                                    </p>
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
                            {/* Green Background */}
                            <div
                                className="absolute -bottom-6 -right-6 w-full h-full z-0"
                                style={{ backgroundColor: "#a5cd39" }}
                            ></div>

                            {/* Image Container */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden z-10">
                                <Image
                                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                    alt="Conference meeting room with people"
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

export default EventManagementServices;
