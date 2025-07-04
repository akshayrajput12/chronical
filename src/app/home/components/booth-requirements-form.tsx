"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { contactPageService } from "@/services/contact-page.service";

interface BoothFormErrors {
    name?: string;
    email?: string;
    message?: string;
    file?: string;
    general?: string;
}

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
    const [errors, setErrors] = useState<BoothFormErrors>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field as keyof BoothFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            file,
        }));
        // Clear file error when user selects a file
        if (errors.file) {
            setErrors(prev => ({
                ...prev,
                file: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: BoothFormErrors = {};

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        // File validation
        if (formData.file) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (formData.file.size > maxSize) {
                newErrors.file = "File size must be less than 10MB";
            }

            const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
            const fileExtension = '.' + formData.file.name.split('.').pop()?.toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                newErrors.file = `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            let attachmentUrl = "";
            let attachmentFilename = "";
            let attachmentSize = 0;
            let attachmentType = "";

            // Upload file if present
            if (formData.file) {
                try {
                    const uploadResult = await contactPageService.uploadFile(formData.file);
                    if (uploadResult.success && uploadResult.url) {
                        attachmentUrl = uploadResult.url;
                        attachmentFilename = formData.file.name;
                        attachmentSize = formData.file.size;
                        attachmentType = formData.file.type;
                    } else {
                        console.error("File upload failed:", uploadResult.error);
                        setErrors({ file: uploadResult.error || "Failed to upload file. Please try again." });
                        setIsSubmitting(false);
                        return;
                    }
                } catch (uploadError) {
                    console.error("File upload error:", uploadError);
                    setErrors({ file: "Failed to upload file. Please try again." });
                    setIsSubmitting(false);
                    return;
                }
            }

            // Submit form data to contact form submissions (booth requirements use same table)
            const submitResult = await contactPageService.submitForm({
                name: formData.name,
                exhibition_name: formData.exhibitionName || undefined,
                company_name: formData.companyName || undefined,
                email: formData.email,
                phone: formData.phone || undefined,
                message: formData.message,
                attachment_url: attachmentUrl || undefined,
                attachment_filename: attachmentFilename || undefined,
                attachment_size: attachmentSize || undefined,
                attachment_type: attachmentType || undefined,
                agreed_to_terms: true, // Booth requirements don't require explicit terms agreement
            });

            if (!submitResult.success) {
                console.error("Form submission failed:", submitResult.error);
                setErrors({ general: submitResult.error || "Failed to submit form. Please try again." });
                setIsSubmitting(false);
                return;
            }

            setIsSubmitted(true);

            // Reset form after 5 seconds
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
                setErrors({});

                // Clear file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = "";
                }
            }, 5000);

        } catch (error) {
            console.error("Form submission error:", error);
            setErrors({
                general: "Failed to submit form. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
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
                                        className={`w-full h-10 px-4 py-3 text-sm bg-white border ${
                                            errors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                        } focus:ring-1 rounded-md placeholder:text-gray-500 transition-all duration-200`}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
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
                                        disabled={isSubmitting}
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
                                        className={`w-full h-10 px-4 py-3 text-sm bg-white border ${
                                            errors.email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                        } focus:ring-1 rounded-md placeholder:text-gray-500 transition-all duration-200`}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
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
                                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                    <div className={`flex items-center justify-between w-full h-10 px-4 py-2 text-sm bg-white border ${
                                        errors.file
                                            ? 'border-red-500 hover:border-red-500 focus-within:border-red-500'
                                            : 'border-gray-300 hover:border-[#a5cd39] focus-within:border-[#a5cd39]'
                                    } rounded-md cursor-pointer transition-all duration-200`}>
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
                                {errors.file && (
                                    <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                                )}
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
                                    className={`w-full min-h-[120px] px-4 py-3 text-sm bg-white border ${
                                        errors.message
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                    } focus:ring-1 rounded-md resize-none placeholder:text-gray-500 transition-all duration-200`}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                )}
                            </div>

                            {/* Error Display */}
                            {errors.general && (
                                <div className="text-center">
                                    <p className="text-red-500 text-sm">{errors.general}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="text-center pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#a5cd39] hover:bg-[#8fb32a] text-black px-12 py-4 text-sm font-semibold transition-all duration-200 rounded-md font-noto-kufi-arabic tracking-wider min-w-[200px] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
