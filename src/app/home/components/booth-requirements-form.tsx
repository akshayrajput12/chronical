"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

const BoothRequirementsForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        exhibitionName: "",
        companyName: "",
        email: "",
        phone: "",
        budget: "",
        message: "",
        file: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: "",
                exhibitionName: "",
                companyName: "",
                email: "",
                phone: "",
                budget: "",
                message: "",
                file: null,
            });
        }, 3000);
    };

    if (isSubmitted) {
        return (
            <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                        }}
                    />
                    <div className="absolute inset-0 bg-black/70" />
                </div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <CheckCircle className="w-16 h-16 text-[#a5cd39] mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Thank You for Your Requirements!
                            </h3>
                            <p className="text-lg text-gray-200">
                                We&apos;ve received your booth requirements and
                                will get back to you with a customized solution
                                within 24 hours.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-black/70" />
            </div>

            <div className="relative z-10 mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Title */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-xl leading-[44px] md:text-3xl lg:text-4xl font-rubik font-bold text-white tracking-wide text-center">
                            Describe Your Trade Show Booth Requirements
                        </h2>
                        <div className="flex !mb-2 justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                    </motion.div>

                    {/* Form and Map Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Form Section */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {/* Row 1: Company Name and Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={e =>
                                            handleInputChange(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-10 px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="exhibitionName"
                                        type="text"
                                        placeholder="Enter Exhibition name"
                                        value={formData.exhibitionName}
                                        onChange={e =>
                                            handleInputChange(
                                                "exhibitionName",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-10 px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={e =>
                                            handleInputChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-10 px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter phone number with country code"
                                        value={formData.phone}
                                        onChange={e =>
                                            handleInputChange(
                                                "phone",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-10 px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="Enter Company name"
                                    value={formData.companyName}
                                    onChange={e =>
                                        handleInputChange(
                                            "companyName",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-10 px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                    required
                                />
                            </div>
                            {/* Row 2: File Upload */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />
                                    <div className="flex items-center justify-between w-full h-10 px-4 py-2 text-sm bg-white border border-gray-300 hover:border-[#a5cd39] focus-within:border-[#a5cd39] rounded-md cursor-pointer transition-all duration-200">
                                        <span
                                            className={`${
                                                formData.file
                                                    ? "text-gray-700 font-noto-kufi-arabic"
                                                    : "text-gray-500 font-noto-kufi-arabic"
                                            }`}
                                        >
                                            {formData.file
                                                ? formData.file.name
                                                : "Choose files (PDF, DOC, JPG, PNG)"}
                                        </span>
                                        <span className="text-xs text-gray-600 font-noto-kufi-arabic bg-gray-200 px-3 py-1 rounded-sm font-medium">
                                            BROWSE
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 4: Message */}
                            <div className="space-y-2">
                                <Textarea
                                    id="message"
                                    placeholder="Describe your booth requirements, design preferences, special features, or any specific customizations you need..."
                                    value={formData.message}
                                    onChange={e =>
                                        handleInputChange(
                                            "message",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full min-h-[120px] px-4 py-3 text-sm bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md resize-none placeholder:text-gray-500 transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="text-center pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#a5cd39] hover:bg-[#8fb32a] text-black px-12 py-4 text-sm font-semibold transition-all duration-200 rounded-md font-noto-kufi-arabic uppercase tracking-wider min-w-[200px] shadow-sm hover:shadow-md"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        "SUBMIT REQUEST"
                                    )}
                                </Button>
                                {/* show this message on form submit */}
                                {/* <p className="text-white/90 text-2xl font-markazi-text mt-4 max-w-lg mx-auto leading-relaxed">
                                    Our team will review your requirements and
                                    provide a detailed proposal within 24 hours.
                                </p> */}
                            </div>
                        </motion.form>

                        {/* Map Section */}
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
            </div>
        </section>
    );
};

export default BoothRequirementsForm;
