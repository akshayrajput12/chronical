"use client";

import React from "react";
import { motion } from "framer-motion";

const KioskBenefits = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section Title */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
                            SURE BENEFITS OF CUSTOM KIOSK
                        </h2>
                        <div className="w-24 h-1 bg-[#a5cd39] mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Nowadays people admire innovation. Anything that is
                            handy & unique appeals to them. Customized kiosk
                            solutions are big thumbs up if you wish to impress
                            visitors coming to the show. Let&apos;s have a quick
                            look at the key benefits:
                        </p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Benefit 1 */}
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#a5cd39] transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#333333] text-center uppercase">
                                GOOD FOR ENGAGING CONSUMERS
                            </h3>
                            <p className="text-gray-600">
                                Talking about trade shows the most important
                                factor is the involvement of the visitors.
                                Custom kiosks are greatly interactive displays
                                that come with a clear & well-organized customer
                                interaction system to ensure better customer
                                engagement.
                            </p>
                        </motion.div>

                        {/* Benefit 2 */}
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#a5cd39] transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#333333] text-center uppercase">
                                ENSURE HIGHER EFFICIENCY
                            </h3>
                            <p className="text-gray-600">
                                Besides better consumer experience, custom
                                kiosks enhance the efficiency of any brand or
                                business group. Customized kiosks are digital &
                                digitalization surely improves the rate of
                                efficiency.
                            </p>
                        </motion.div>

                        {/* Benefit 3 */}
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-[#a5cd39] transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#333333] text-center uppercase">
                                HIGHLY FLEXIBLE CUSTOM KIOSKS
                            </h3>
                            <p className="text-gray-600">
                                As customized kiosks are technology-based &
                                manufactured keeping in view your dynamic
                                business needs they are adaptable. You can
                                easily change the information on the
                                KIOSK&apos;s wing touch screens as the business
                                needs change.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KioskBenefits;
