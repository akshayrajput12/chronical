"use client";

import React from "react";

const BoothRequirements = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main Card */}
                    <div className="border-2 border-[#a5cd39] rounded-lg p-8 md:p-12 bg-white shadow-sm hover:shadow-md transition-shadow duration-300  mx-auto">
                        {/* Heading */}
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-rubik font-bold text-center capitalize text-gray-900 mb-6">
                            Describe Your Exhibition Booth Requirements
                        </h2>

                        {/* Contact Information */}
                        <div className="text-center text-lg md:text-xl font-noto-kufi-arabic text-gray-700">
                            <span>Call </span>
                            <a
                                href="tel:+971543474645"
                                className="text-[#a5cd39] hover:text-[#94b933] font-semibold transition-colors duration-200"
                            >
                                +971 54 347 4645
                            </a>
                            <span> or submit enquiry form below</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BoothRequirements;
