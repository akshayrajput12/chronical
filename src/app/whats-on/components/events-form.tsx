"use client";

import React, { useState } from "react";
import { EventFormSubmissionInput } from "@/types/events";

interface EventsFormProps {
    eventId?: string;
    onSubmit?: (data: EventFormSubmissionInput) => void;
    className?: string;
}

interface EventFormErrors {
    name?: string;
    email?: string;
    message?: string;
    file?: string;
    general?: string;
}

export const EventsForm: React.FC<EventsFormProps> = ({
    eventId,
    onSubmit,
    className = "",
}) => {
    const [formData, setFormData] = useState({
        name: "",
        exhibition_name: "",
        company_name: "",
        email: "",
        phone: "",
        budget: "",
        message: "",
        file: null as File | null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });
    const [errors, setErrors] = useState<EventFormErrors>({});

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: EventFormErrors = {};

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

    // Handler for input changes
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name as keyof EventFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Handler for file input change
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

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: "" });
        setErrors({});

        try {
            const attachmentUrl = "";
            let attachmentFilename = "";
            let attachmentSize = 0;

            // Upload file if present
            if (formData.file) {
                // TODO: Implement file upload to Supabase storage
                // For now, we'll just store the file info
                attachmentFilename = formData.file.name;
                attachmentSize = formData.file.size;
            }

            // Prepare submission data
            const submissionData: EventFormSubmissionInput = {
                event_id: eventId,
                name: formData.name,
                exhibition_name: formData.exhibition_name || undefined,
                company_name: formData.company_name || undefined,
                email: formData.email,
                phone: formData.phone || undefined,
                budget: formData.budget || undefined,
                message: formData.message || undefined,
                attachment_url: attachmentUrl || undefined,
                attachment_filename: attachmentFilename || undefined,
                attachment_size: attachmentSize || undefined,
            };

            // Submit to API
            const response = await fetch("/api/events/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: "success",
                    message:
                        result.message ||
                        "Form submitted successfully! We will get back to you soon.",
                });

                // Reset form
                setFormData({
                    name: "",
                    exhibition_name: "",
                    company_name: "",
                    email: "",
                    phone: "",
                    budget: "",
                    message: "",
                    file: null,
                });

                // Clear file input
                const fileInput = document.querySelector(
                    'input[type="file"]',
                ) as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = "";
                }

                // Call onSubmit callback if provided
                if (onSubmit) {
                    onSubmit(submissionData);
                }
            } else {
                setSubmitStatus({
                    type: "error",
                    message:
                        result.error ||
                        "Failed to submit form. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({
                general: "An error occurred while submitting the form. Please try again."
            });
            setSubmitStatus({
                type: "error",
                message:
                    "An error occurred while submitting the form. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <section className={`py-16 bg-black/60 ${className}`}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center text-white mb-4">
                    Get in Touch
                    <div className="w-16 h-1 my-2 bg-[#a5cd39] mx-auto"></div>
                </h2>
                <p className="text-center text-white/80 mb-8 max-w-2xl mx-auto">
                    Interested in this event? Fill out the form below and we'll
                    get back to you with more information.
                </p>

                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
                    {/* Status Messages */}
                    {submitStatus.type && (
                        <div
                            className={`mb-6 p-4 rounded-md ${
                                submitStatus.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {submitStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Simple responsive grid for all main fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name *"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`h-8 px-2 py-1 text-xs border ${
                                        errors.name
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                    } rounded-md w-full focus:ring-1 placeholder:text-gray-500 transition-all duration-200`}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                )}
                            </div>
                            <input
                                type="text"
                                name="exhibition_name"
                                placeholder="Exhibition Name"
                                value={formData.exhibition_name}
                                onChange={handleInputChange}
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                disabled={isSubmitting}
                            />
                            <input
                                type="text"
                                name="company_name"
                                placeholder="Company Name"
                                value={formData.company_name}
                                onChange={handleInputChange}
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                disabled={isSubmitting}
                            />
                            <div className="space-y-1">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email *"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`h-8 px-2 py-1 text-xs border ${
                                        errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                    } rounded-md w-full focus:ring-1 placeholder:text-gray-500 transition-all duration-200`}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                )}
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone (with country code)"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                disabled={isSubmitting}
                            />
                            <input
                                type="text"
                                name="budget"
                                placeholder="Budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* File upload full width */}
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    title="Upload File (PDF, DOC, JPG, PNG)"
                                    disabled={isSubmitting}
                                />
                                <div className={`flex items-center justify-between w-full h-10 px-1 pl-2 py-2 text-sm bg-white border ${
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
                                <p className="text-red-500 text-xs">{errors.file}</p>
                            )}
                        </div>
                        {/* Textarea full width */}
                        <div className="space-y-1">
                            <textarea
                                name="message"
                                placeholder="Tell us about your event requirements, booth specifications, or any questions you have..."
                                value={formData.message}
                                onChange={handleInputChange}
                                className={`min-h-[40px] h-16 px-2 py-1 text-xs border ${
                                    errors.message
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-[#a5cd39] focus:ring-[#a5cd39]'
                                } rounded-md w-full focus:ring-1 placeholder:text-gray-500 transition-all duration-200 resize-none`}
                                disabled={isSubmitting}
                                required
                            />
                            {errors.message && (
                                <p className="text-red-500 text-xs">{errors.message}</p>
                            )}
                        </div>
                        {/* Error Display */}
                        {errors.general && (
                            <div className="text-center">
                                <p className="text-red-500 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Submit button centered */}
                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isSubmitting
                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        : "bg-[#a5cd39] text-white hover:bg-[#94b933]"
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
