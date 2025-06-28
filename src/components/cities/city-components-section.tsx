"use client";

import React from "react";
import { motion } from "framer-motion";
import { City } from "@/types/cities";

interface CityComponentsSectionProps {
    city: City;
}

const CityComponentsSection = ({ city }: CityComponentsSectionProps) => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Title */}
                    <motion.div
                        className="text-center mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl capitalize md:text-4xl font-rubik font-bold mb-2">
                            Components that we keep in mind for designing a
                            productive exhibition stand
                        </h2>
                    </motion.div>
                    <div className="flex justify-center">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                    </div>

                    {/* Introduction Paragraph */}
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-5xl mx-auto">
                            A large number of{" "}
                            <strong>
                                exhibition stand design companies in Abu Dhabi
                            </strong>{" "}
                            are active around us but professional brands look
                            for skilled{" "}
                            <strong>exhibition stand builders</strong> like
                            Chronicle Exhibits (Chronicle Exhibition Organizing
                            LLC), for functional & quality booth design ideas.
                            Being in this field for years, we suggest the right
                            trade show booth design fulfilling your business
                            objectives. Let's go through the factors we take
                            into account:
                        </p>
                    </motion.div>

                    {/* Six Components Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
                        {/* Component 1: Study the Latest Trends */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                STUDY THE LATEST TRENDS
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                To create an exceptional booth design it is
                                significant to analyze the kind of booths that
                                are in great demand at present. The exhibition
                                stand designs crafted after a deep analysis of
                                the new trends help you enrich your brand
                                impact.
                            </p>
                        </motion.div>

                        {/* Component 2: Collect Information */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                COLLECT INFORMATION
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                We ask our clients about other exhibitors those
                                are participating with you in the show. This
                                helps our team to learn about their business
                                activities & we prepare a{" "}
                                <strong>best stand design</strong> that can win
                                over your competitors.
                            </p>
                        </motion.div>

                        {/* Component 3: Investigate Your Audience */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                INVESTIGATE YOUR AUDIENCE
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                Chronicle Exhibits evaluate your targeted
                                audience after an in-depth analysis of the
                                products & services you offer. We suggest you an
                                3D exhibition stand design that passes on your
                                brand message to the visitors.
                            </p>
                        </motion.div>

                        {/* Component 4: Interactive Solutions */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                INTERACTIVE SOLUTIONS
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                We try our best to design your exhibition booth
                                with an integration of digital features. Going
                                digital is one of the{" "}
                                <span style={{ color: "#a5cd39" }}>
                                    creative ways of designing inviting booths
                                </span>{" "}
                                able to seek the direct attention of the show
                                attendees.
                            </p>
                        </motion.div>

                        {/* Component 5: Clever Space Management */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                CLEVER SPACE MANAGEMENT
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                The exhibition area is a crucial point for booth
                                design. We as a dedicated exhibition stand
                                contractor in Abu Dhabi, UAE use smart
                                strategies for maximum utilization of your booth
                                space. We make sure that your exhibition stand
                                has proper space for visitors to move.
                            </p>
                        </motion.div>

                        {/* Component 6: Develop a Strong Branding */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3
                                className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-wide"
                                style={{ color: "#a5cd39" }}
                            >
                                DEVELOP A STRONG BRANDING
                            </h3>
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                Many stand-building & designing companies
                                construct a trade show booth around an
                                impressive theme but it is not that impactful.
                                This is so because the brand & the booth are not
                                interlinked. We make hard efforts to align your
                                brand with the booth for desirable gains.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityComponentsSection;
