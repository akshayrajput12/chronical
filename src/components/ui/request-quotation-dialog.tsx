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
    const [errors, setErrors] = React.useState<{[key: string]: string}>({});
    const [submitError, setSubmitError] = React.useState<string>('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

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
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else {
            // Basic phone validation - should contain at least 7 digits
            const phoneDigits = form.phone.replace(/\D/g, '');
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
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const submissionData = {
                name: form.name,
                exhibition_name: form.exhibitionName || undefined,
                company_name: form.companyName || undefined,
                email: form.email,
                phone: form.phone || undefined,
                budget: form.budget || undefined,
                message: `[QUOTATION REQUEST] ${form.message || 'Request for quotation'}`,
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
                setSubmitError(result.error || 'Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error("Form submission error:", error);
            console.error("Error details:", {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            setSubmitError('Failed to submit request. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="lg:max-w-xl w-full rounded-xl p-0 overflow-hidden">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 space-y-4"
                >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#a5cd39]">
                            Request a Quotation
                        </DialogTitle>
                    </DialogHeader>
                    {isSubmitted ? (
                        <div className="text-center py-12 px-6">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Request Submitted Successfully!
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Thank you for your quotation request. Our team will review your requirements and get back to you within 24 hours.
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                                    <p className="font-medium mb-1">What happens next?</p>
                                    <ul className="text-left space-y-1">
                                        <li>• Our team will review your requirements</li>
                                        <li>• We'll prepare a customized quotation</li>
                                        <li>• You'll receive a detailed proposal via email</li>
                                    </ul>
                                </div>
                                <DialogClose asChild>
                                    <Button
                                        className="mt-4 bg-[#a5cd39] hover:bg-[#8aaa30] text-white"
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
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                                    {submitError}
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label htmlFor="name">Full Name*</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        className={`h-8 ${errors.name ? 'border-red-500' : ''}`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="exhibitionName">
                                        Exhibition Name*
                                    </Label>
                                    <Input
                                        id="exhibitionName"
                                        name="exhibitionName"
                                        value={form.exhibitionName}
                                        className={`h-8 ${errors.exhibitionName ? 'border-red-500' : ''}`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.exhibitionName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.exhibitionName}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="companyName">
                                        Company Name*
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={form.companyName}
                                        className={`h-8 ${errors.companyName ? 'border-red-500' : ''}`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.companyName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="email">
                                        Email Address*
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        className={`h-8 ${errors.email ? 'border-red-500' : ''}`}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number*</Label>
                                    <PhoneInput
                                        value={form.phone}
                                        onChange={(value: string) => {
                                            setForm({ ...form, phone: value });
                                            if (errors.phone) {
                                                setErrors({ ...errors, phone: '' });
                                            }
                                        }}
                                        placeholder="Enter phone number"
                                        className="w-full"
                                        disabled={isSubmitting}
                                        error={!!errors.phone}
                                        name="phone"
                                        required
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="budget">Budget</Label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={form.budget}
                                        className="h-8"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message">
                                        Your Message*
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={form.message}
                                        className={errors.message ? 'border-red-500' : ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex justify-between items-center">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="bg-[#a5cd39] hover:bg-[#8aaa30] text-white"
                                    disabled={isSubmitting}
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
