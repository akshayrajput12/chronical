"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

export function RequestQuotationDialog({
    trigger,
}: {
    trigger: React.ReactNode;
}) {
    const [form, setForm] = React.useState({
        name: "",
        exhibitionName: "",
        companyName: "",
        email: "",
        phone: "",
        budget: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [submitError, setSubmitError] = React.useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Required field validation
        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.exhibitionName.trim()) {
            newErrors.exhibitionName = "Exhibition name is required";
        }

        if (!form.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
        ) {
            newErrors.email = "Invalid email format";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else {
            // Basic phone validation - should contain at least 7 digits
            const phoneDigits = form.phone.replace(/\D/g, "");
            if (phoneDigits.length < 7) {
                newErrors.phone = "Please enter a valid phone number";
            }
        }

        if (!form.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Submitting form");
        e.preventDefault();
        console.log(validateForm());
        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const submissionData = {
                name: form.name,
                exhibition_name: form.exhibitionName || undefined,
                company_name: form.companyName || undefined,
                email: form.email,
                phone: form.phone || undefined,
                budget: form.budget || undefined,
                message: `[QUOTATION REQUEST] ${
                    form.message || "Request for quotation"
                }`,
                agreed_to_terms: true, // Request quotation doesn't require explicit terms agreement
            };

            console.log("Submitting quotation request:", submissionData);

            // Submit to contact API (same as booth requirements form)
            const response = await fetch("/api/contact/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const result = await response.json();
            console.log("Response data:", result);

            if (response.ok && result.success) {
                console.log("Form submitted successfully!");
                setIsSubmitted(true);
                // Auto-close dialog after 8 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    // Reset form for next use
                    setForm({
                        name: "",
                        exhibitionName: "",
                        companyName: "",
                        email: "",
                        phone: "",
                        budget: "",
                        message: "",
                    });
                }, 8000);
            } else {
                console.error("Form submission failed:", result.error);
                setSubmitError(
                    result.error ||
                        "Failed to submit request. Please try again.",
                );
            }
        } catch (error) {
            console.error("Form submission error:", error);
            console.error("Error details:", {
                name: error instanceof Error ? error.name : "Unknown",
                message:
                    error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : "No stack trace",
            });
            setSubmitError(
                "Failed to submit request. Please check your connection and try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className=" w-full max-h-[600px] lg:max-h-screen overflow-y-auto rounded-xl p-0 bg-gradient-to-br from-[#f8fafc] via-[#f3f7ef] to-[#e9f5d8] shadow-xl border-0">
                <form className="bg-white/95 w-full sm:p-6 p-4 rounded-xl shadow-md">
                    <DialogHeader>
                        <div className="flex flex-col items-center justify-center mb-2 mt-2">
                            <div className="bg-[#a5cd39]/20 rounded-full p-2 mb-1">
                                <svg
                                    className="w-7 h-7 text-[#a5cd39]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <DialogTitle className="text-lg sm:text-xl font-bold text-[#1a2c1a] tracking-tight text-center">
                                Request a Quotation
                            </DialogTitle>
                            <p className="text-gray-600 text-xs mt-1 text-center max-w-xs">
                                Fill out the form below and our team will get
                                back to you with a customized quotation within
                                24 hours.
                            </p>
                        </div>
                    </DialogHeader>
                    {isSubmitted ? (
                        <div className="text-center py-8 px-4">
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    Request Submitted Successfully!
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    Thank you for your quotation request. Our
                                    team will review your requirements and get
                                    back to you within 24 hours.
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                                    <p className="font-medium mb-1">
                                        What happens next?
                                    </p>
                                    <ul className="text-left space-y-1">
                                        <li>
                                            • Our team will review your
                                            requirements
                                        </li>
                                        <li>
                                            • We'll prepare a customized
                                            quotation
                                        </li>
                                        <li>
                                            • You'll receive a detailed proposal
                                            via email
                                        </li>
                                    </ul>
                                </div>
                                <DialogClose asChild>
                                    <Button
                                        className="mt-3 bg-[#a5cd39] hover:bg-[#8aaa30] text-white text-sm px-4 py-2 rounded"
                                        onClick={() => {
                                            setIsSubmitted(false);
                                            setForm({
                                                name: "",
                                                exhibitionName: "",
                                                companyName: "",
                                                email: "",
                                                phone: "",
                                                budget: "",
                                                message: "",
                                            });
                                        }}
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                    ) : (
                        <>
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3 text-xs">
                                    {submitError}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-3">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Full Name*
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        className={`h-8 mt-1 px-2 rounded border focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 text-sm ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        }`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Email Address*
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        className={`h-8 mt-1 px-2 rounded border focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 text-sm ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        }`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="companyName"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Company Name*
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={form.companyName}
                                        className={`h-8 mt-1 px-2 rounded border focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 text-sm ${
                                            errors.companyName
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        }`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.companyName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.companyName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="exhibitionName"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Exhibition Name*
                                    </Label>
                                    <Input
                                        id="exhibitionName"
                                        name="exhibitionName"
                                        value={form.exhibitionName}
                                        className={`h-8 mt-1 px-2 rounded border focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 text-sm ${
                                            errors.exhibitionName
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        }`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.exhibitionName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.exhibitionName}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Label
                                        htmlFor="phone"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Phone Number*
                                    </Label>
                                    <PhoneInput
                                        value={form.phone}
                                        onChange={(value: string) => {
                                            setForm({ ...form, phone: value });
                                            if (errors.phone) {
                                                setErrors({
                                                    ...errors,
                                                    phone: "",
                                                });
                                            }
                                        }}
                                        placeholder="Enter phone number"
                                        className="w-full h-8 rounded focus:ring-1 focus:ring-[#a5cd39]/20 text-sm overflow-ellipsis"
                                        disabled={isSubmitting}
                                        error={!!errors.phone}
                                        name="phone"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Label
                                        htmlFor="budget"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Budget
                                    </Label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={form.budget}
                                        className="h-8 mt-1 px-2 rounded border border-gray-200 focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 text-sm"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label
                                        htmlFor="message"
                                        className="font-medium text-gray-800 text-sm"
                                    >
                                        Your Message*
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        className={`mt-1 px-2 py-1 rounded border focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39]/20 min-h-[70px] text-sm ${
                                            errors.message
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        }`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto text-sm px-4 py-2"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="bg-[#a5cd39] hover:bg-[#8aaa30] text-white w-full sm:w-auto font-semibold text-sm py-2 px-6 rounded shadow transition-all"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Request"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
