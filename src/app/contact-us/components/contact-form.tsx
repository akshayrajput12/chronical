"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { ContactFormSettings, ContactFormData, ContactFormErrors } from "@/types/contact";
import { contactPageService } from "@/lib/services/contact";

interface ContactFormProps {
    formSettings: ContactFormSettings | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ formSettings }) => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        exhibitionName: "",
        companyName: "",
        email: "",
        phone: "",
        message: "",
        file: null,
        agreedToTerms: false,
    });

    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Default fallback data
    const defaultFormSettings: ContactFormSettings = {
        id: "default",
        form_title: "Feel Free To Write",
        form_subtitle: "",
        success_message: "Thank You for Your Message!",
        success_description: "We've received your inquiry and will get back to you within 24 hours.",
        sidebar_phone: "+971 54 347 4645",
        sidebar_email: "info@chronicleexhibts.ae",
        sidebar_address: "Al Qouz Industrial Area 1st. No. 5B, Warehouse 14 P.O. Box 128046, Dubai – UAE",
        enable_file_upload: true,
        max_file_size_mb: 10,
        allowed_file_types: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
        require_terms_agreement: true,
        terms_text: "By clicking submit, you agree to our Terms and Conditions",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const displaySettings = formSettings || defaultFormSettings;

    const validateForm = (): boolean => {
        const newErrors: ContactFormErrors = {};

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

        if (displaySettings.require_terms_agreement && !formData.agreedToTerms) {
            newErrors.agreedToTerms = "You must agree to the terms and conditions";
        }

        // File validation
        if (formData.file) {
            const maxSize = displaySettings.max_file_size_mb * 1024 * 1024; // Convert MB to bytes
            if (formData.file.size > maxSize) {
                newErrors.file = `File size must be less than ${displaySettings.max_file_size_mb}MB`;
            }

            const fileExtension = '.' + formData.file.name.split('.').pop()?.toLowerCase();
            if (!displaySettings.allowed_file_types.includes(fileExtension)) {
                newErrors.file = `File type not allowed. Allowed types: ${displaySettings.allowed_file_types.join(', ')}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ContactFormData, value: string | boolean | File | null) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleInputChange('file', file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Upload file if present
            const attachmentUrl = null;
            let attachmentFilename = null;
            let attachmentSize = null;
            let attachmentType = null;

            if (formData.file) {
                // TODO: Implement file upload to Supabase storage
                // For now, we'll skip file upload and just store the filename
                attachmentFilename = formData.file.name;
                attachmentSize = formData.file.size;
                attachmentType = formData.file.type;
            }

            // Submit form data
            await contactPageService.submitContactForm({
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
                agreed_to_terms: formData.agreedToTerms,
            });

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
                    message: "",
                    file: null,
                    agreedToTerms: false,
                });
                setErrors({});
            }, 5000);

        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitError(error instanceof Error ? error.message : "Failed to submit form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <CheckCircle className="w-16 h-16 text-[#a5cd39] mx-auto mb-6" />
                            <h3 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
                                {displaySettings.success_message}
                            </h3>
                            <p className="text-lg font-nunito text-gray-600">
                                {displaySettings.success_description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl text-left font-rubik font-bold mb-1">
                        {displaySettings.form_title}
                    </h2>
                    {displaySettings.form_subtitle && (
                        <p className="text-lg text-gray-600 mb-2">{displaySettings.form_subtitle}</p>
                    )}
                    <div className="flex !mb-2">
                        <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-6"></div>
                    </div>

                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{submitError}</p>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-12">
                        <motion.form
                            onSubmit={handleSubmit}
                            className="bg-white p-0 w-full md:w-[70%]"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Full Name*
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={e =>
                                            handleInputChange(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full h-9 px-4 py-3 text-base border focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 rounded-md shadow-sm ${
                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label
                                        htmlFor="exhibitionName"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Exhibition Name*
                                    </Label>
                                    <Input
                                        id="exhibitionName"
                                        type="text"
                                        value={formData.exhibitionName}
                                        onChange={e =>
                                            handleInputChange(
                                                "exhibitionName",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-9 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Email Address*
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e =>
                                            handleInputChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full h-9 px-4 py-3 text-base border focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 rounded-md shadow-sm ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Phone Number*
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
                                        className="w-full h-9 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="companyName"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Company Name*
                                    </Label>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        value={formData.companyName}
                                        onChange={e =>
                                            handleInputChange(
                                                "companyName",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full h-9 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 rounded-md shadow-sm"
                                        required
                                    />
                                </div>
                                {displaySettings.enable_file_upload && (
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="file-upload"
                                            className="text-sm font-medium text-gray-800"
                                        >
                                            Upload Documents (Optional)
                                        </Label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                accept={displaySettings.allowed_file_types.join(',')}
                                            />
                                            <div className={`flex items-center justify-between w-full h-9 px-3 py-2 text-sm bg-gray-100 border hover:border-[#a5cd39] focus-within:border-[#a5cd39] rounded-md cursor-pointer transition-all duration-200 ${
                                                errors.file ? 'border-red-300' : 'border-gray-300'
                                            }`}>
                                                <span className="text-gray-600 text-xs truncate">
                                                    {formData.file ? formData.file.name : 'No file selected'}
                                                </span>
                                                <span className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-sm font-medium">
                                                    BROWSE
                                                </span>
                                            </div>
                                        </div>
                                        {errors.file && (
                                            <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Max file size: {displaySettings.max_file_size_mb}MB.
                                            Allowed types: {displaySettings.allowed_file_types.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="message"
                                        className="text-sm font-medium text-gray-800"
                                    >
                                        Your Message*
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        placeholder="Describe your requirements, preferences, or any specific details..."
                                        onChange={e =>
                                            handleInputChange(
                                                "message",
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full h-32 px-4 py-3 text-base border focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-gray-100 resize-none rounded-md shadow-sm ${
                                            errors.message ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                    )}
                                </div>
                            </div>

                            {displaySettings.require_terms_agreement && (
                                <div className="mb-6">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={formData.agreedToTerms}
                                            onChange={e =>
                                                handleInputChange('agreedToTerms', e.target.checked)
                                            }
                                            className="mt-1 w-4 h-4 text-[#a5cd39] border-gray-300 rounded focus:ring-2 focus:ring-[#a5cd39]"
                                            required
                                        />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm text-gray-600 leading-relaxed"
                                        >
                                            {displaySettings.terms_text}
                                        </label>
                                    </div>
                                    {errors.agreedToTerms && (
                                        <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms}</p>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting || (displaySettings.require_terms_agreement && !formData.agreedToTerms)}
                                className="bg-[#007bff] hover:bg-[#0056b3] text-white px-8 py-3 text-sm font-medium transition-all duration-300 rounded-md tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    "SEND YOUR MESSAGE"
                                )}
                            </Button>
                        </motion.form>
                        <div
                            className="w-full relative md:w-[30%] bg-gray-100 h-max p-8 flex flex-col justify-between
                            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="bg-[#a5cd39] w-full h-[2px] absolute top-0 left-0"></div>
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-700 mb-1">
                                        Call anytime
                                    </h3>
                                    <div className="text-base !font-bold text-gray-900 mb-2">
                                        <Link
                                            href={`tel:${displaySettings.sidebar_phone.replace(/\s+/g, '')}`}
                                            className="text-[#a5cd39] !text-base !font-semibold"
                                        >
                                            {displaySettings.sidebar_phone}
                                        </Link>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                                        Send Email
                                    </h3>
                                    <div className="text-base font-semibold text-gray-900 mb-2">
                                        <Link
                                            href={`mailto:${displaySettings.sidebar_email}`}
                                            className="text-[#a5cd39] !text-base !font-semibold"
                                        >
                                            {displaySettings.sidebar_email}
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-1">
                                        Visit Office
                                    </h3>
                                    <div className="text-base text-gray-700">
                                        {displaySettings.sidebar_address.split(',').map((line, index) => (
                                            <span key={index}>
                                                {line.trim()}
                                                {index < displaySettings.sidebar_address.split(',').length - 1 && <br />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
