"use client";

import React, { useState } from "react";
import { EventFormSubmissionInput } from "@/types/events";
import { contactPageService } from "@/services/contact-page.service";
import { PhoneInput } from "@/components/ui/phone-input";

interface EventsFormProps {
    eventId?: string;
    onSubmit?: (data: EventFormSubmissionInput) => void;
    className?: string;
}

interface EventFormErrors {
    name?: string;
    email?: string;
    phone?: string;
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
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                formData.email,
            )
        ) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        // Phone validation (optional but if provided should be valid)
        if (formData.phone && formData.phone.trim()) {
            // Basic phone validation - should contain at least 7 digits
            const phoneDigits = formData.phone.replace(/\D/g, "");
            if (phoneDigits.length < 7) {
                newErrors.phone = "Please enter a valid phone number";
            }
        }

        // File validation
        if (formData.file) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (formData.file.size > maxSize) {
                newErrors.file = "File size must be less than 10MB";
            }

            const allowedTypes = [
                ".pdf",
                ".doc",
                ".docx",
                ".jpg",
                ".jpeg",
                ".png",
            ];
            const fileExtension =
                "." + formData.file.name.split(".").pop()?.toLowerCase();
            if (!allowedTypes.includes(fileExtension)) {
                newErrors.file = `File type not allowed. Allowed types: ${allowedTypes.join(
                    ", ",
                )}`;
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
            let attachmentUrl = "";
            let attachmentFilename = "";
            let attachmentSize = 0;

            // Upload file if present
            if (formData.file) {
                try {
                    const uploadResult = await contactPageService.uploadFile(
                        formData.file,
                    );
                    if (uploadResult.success && uploadResult.url) {
                        attachmentUrl = uploadResult.url;
                        attachmentFilename = formData.file.name;
                        attachmentSize = formData.file.size;
                    } else {
                        console.error(
                            "File upload failed:",
                            uploadResult.error,
                        );
                        setErrors({
                            file:
                                uploadResult.error ||
                                "Failed to upload file. Please try again.",
                        });
                        setIsSubmitting(false);
                        return;
                    }
                } catch (uploadError) {
                    console.error("File upload error:", uploadError);
                    setErrors({
                        file: "Failed to upload file. Please try again.",
                    });
                    setIsSubmitting(false);
                    return;
                }
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

            // Submit to contact API for unified form management
            const response = await fetch("/api/contact/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    exhibition_name: formData.exhibition_name || undefined,
                    company_name: formData.company_name || undefined,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    budget: formData.budget || undefined,
                    message: `[EVENT INQUIRY] ${
                        eventId ? `Event ID: ${eventId} - ` : ""
                    }${formData.message || "Event inquiry submission"}`,
                    attachment_url: attachmentUrl || undefined,
                    attachment_filename: attachmentFilename || undefined,
                    attachment_size: attachmentSize || undefined,
                    agreed_to_terms: true, // Event forms don't require explicit terms agreement
                }),
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
                general:
                    "An error occurred while submitting the form. Please try again.",
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
        <section className={`py-8 md:py-12 lg:py-16 ${className}`}>
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
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
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name *"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`h-9 px-3 py-2 text-sm border-2 ${
                                            errors.name
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                : "border-gray-200 focus:border-[#a5cd39] focus:ring-[#a5cd39]"
                                        } rounded-lg w-full focus:ring-2 placeholder:text-gray-400 transition-all duration-300 bg-gray-50 focus:bg-white`}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    name="exhibition_name"
                                    placeholder="Exhibition Name"
                                    value={formData.exhibition_name}
                                    onChange={handleInputChange}
                                    className="h-9 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg w-full focus:border-[#a5cd39] focus:ring-2 focus:ring-[#a5cd39] placeholder:text-gray-400 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    disabled={isSubmitting}
                                />
                                <input
                                    type="text"
                                    name="company_name"
                                    placeholder="Company Name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    className="h-9 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg w-full focus:border-[#a5cd39] focus:ring-2 focus:ring-[#a5cd39] placeholder:text-gray-400 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    disabled={isSubmitting}
                                />
                                <div className="space-y-1">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email *"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`h-9 px-3 py-2 text-sm border-2 ${
                                            errors.email
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                : "border-gray-200 focus:border-[#a5cd39] focus:ring-[#a5cd39]"
                                        } rounded-lg w-full focus:ring-2 placeholder:text-gray-400 transition-all duration-300 bg-gray-50 focus:bg-white`}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <PhoneInput
                                        value={formData.phone}
                                        onChange={(value: string) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                phone: value,
                                            }))
                                        }
                                        placeholder="Phone number"
                                        className="w-full"
                                        disabled={isSubmitting}
                                        error={!!errors.phone}
                                        name="phone"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    name="budget"
                                    placeholder="Budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className="h-9 px-3 py-2 text-sm border-2 border-gray-200 rounded-lg w-full focus:border-[#a5cd39] focus:ring-2 focus:ring-[#a5cd39] placeholder:text-gray-400 transition-all duration-300 bg-gray-50 focus:bg-white"
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
                                    <div
                                        className={`flex items-center justify-between w-full h-9 px-3 py-2 text-sm bg-gray-50 border-2 ${
                                            errors.file
                                                ? "border-red-500 hover:border-red-500 focus-within:border-red-500"
                                                : "border-gray-200 hover:border-[#a5cd39] focus-within:border-[#a5cd39]"
                                        } rounded-lg cursor-pointer transition-all duration-300`}
                                    >
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
                                    <p className="text-red-500 text-xs">
                                        {errors.file}
                                    </p>
                                )}
                            </div>
                            {/* Textarea full width */}
                            <div className="space-y-1">
                                <textarea
                                    name="message"
                                    placeholder="Tell us about your event requirements, booth specifications, or any questions you have..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className={`min-h-[100px] px-3 py-2 text-sm border-2 ${
                                        errors.message
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-200 focus:border-[#a5cd39] focus:ring-[#a5cd39]"
                                    } rounded-lg w-full focus:ring-2 placeholder:text-gray-400 transition-all duration-300 resize-none bg-gray-50 focus:bg-white`}
                                    disabled={isSubmitting}
                                    required
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-xs">
                                        {errors.message}
                                    </p>
                                )}
                            </div>
                            {/* Error Display */}
                            {errors.general && (
                                <div className="text-center">
                                    <p className="text-red-500 text-sm">
                                        {errors.general}
                                    </p>
                                </div>
                            )}

                            {/* Submit button centered */}
                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                                        isSubmitting
                                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                            : "bg-[#a5cd39] text-white hover:bg-[#94b933] hover:scale-105"
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
            </div>
        </section>
    );
};
