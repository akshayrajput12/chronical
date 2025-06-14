"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const BoothRequirementsForm = () => {
    const [formData, setFormData] = useState({
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

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-base md:text-2xl lg:text-3xl font-rubik font-bold text-white uppercase tracking-wide text-center">
                            DESCRIBE YOUR TRADE SHOW BOOTH REQUIREMENTS
                        </h2>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {/* Row 1: Company Name and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="companyName"
                                    className="text-white text-base font-medium uppercase tracking-wide"
                                >
                                    Person/Company Name *
                                </Label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="Enter your company name"
                                    value={formData.companyName}
                                    onChange={e =>
                                        handleInputChange(
                                            "companyName",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-14 px-4 py-3 text-base bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label
                                    htmlFor="email"
                                    className="text-white font-medium text-base uppercase tracking-wide"
                                >
                                    Email Address *
                                </Label>
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
                                    className="w-full h-14 px-4 py-3 text-base bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Phone and Budget */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="phone"
                                    className="text-white font-medium text-base uppercase tracking-wide"
                                >
                                    Phone Number *
                                </Label>
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
                                    className="w-full h-14 px-4 py-3 text-base bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label
                                    htmlFor="budget"
                                    className="text-white font-medium text-base uppercase tracking-wide"
                                >
                                    Budget (USD)
                                </Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="e.g., 10000"
                                    value={formData.budget}
                                    onChange={e =>
                                        handleInputChange(
                                            "budget",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-14 px-4 py-3 text-base bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md placeholder:text-gray-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min="0"
                                    step="100"
                                />
                            </div>
                        </div>

                        {/* Row 3: File Upload */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="file-upload"
                                className="text-white font-medium text-base uppercase tracking-wide"
                            >
                                Upload Files for Booth Designs
                            </Label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <div className="flex items-center justify-between w-full h-14 px-4 py-3 text-base bg-white border border-gray-300 hover:border-[#a5cd39] focus-within:border-[#a5cd39] rounded-md cursor-pointer transition-all duration-200">
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
                                    <span className="text-xs text-gray-400 font-noto-kufi-arabic bg-gray-50 px-3 py-1 rounded-sm font-medium">
                                        BROWSE
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Message */}
                        <div className="space-y-1">
                            <Label
                                htmlFor="message"
                                className="text-white font-medium text-base uppercase tracking-wide"
                            >
                                Message/Customizations *
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Describe your booth requirements, design preferences, special features, or any specific customizations you need..."
                                value={formData.message}
                                onChange={e =>
                                    handleInputChange("message", e.target.value)
                                }
                                className="w-full min-h-[120px] px-4 py-3 text-base bg-white border border-gray-300 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] rounded-md resize-none placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#a5cd39] hover:bg-[#8fb32a] text-black px-12 py-4 text-base font-semibold transition-all duration-200 rounded-md font-noto-kufi-arabic uppercase tracking-wider min-w-[200px] shadow-sm hover:shadow-md"
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
                            <p className="text-white/90 text-2xl font-markazi-text mt-4 max-w-lg mx-auto leading-relaxed">
                                Our team will review your requirements and
                                provide a detailed proposal within 24 hours.
                            </p>
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default BoothRequirementsForm;
