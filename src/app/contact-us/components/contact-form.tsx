"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        organization: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
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
                firstName: "",
                lastName: "",
                email: "",
                contactNumber: "",
                organization: "",
                message: "",
            });
            setAgreedToTerms(false);
        }, 3000);
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
                                Thank You for Your Message!
                            </h3>
                            <p className="text-lg font-nunito text-gray-600">
                                We&apos;ve received your inquiry and will get
                                back to you within 24 hours.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-gray-700 font-nunito text-base leading-relaxed">
                            For more information about Dubai World Trade Centre
                            or any of our services, please contact us through
                            the form below.
                        </p>
                    </motion.div>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="bg-gray-100 p-0"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="firstName"
                                    className="text-sm font-medium text-gray-800"
                                >
                                    First Name*
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e =>
                                        handleInputChange(
                                            "firstName",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-12 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label
                                    htmlFor="lastName"
                                    className="text-sm font-medium text-gray-800"
                                >
                                    Last Name*
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e =>
                                        handleInputChange(
                                            "lastName",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-12 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white rounded-md shadow-sm"
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
                                    className="w-full h-12 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white rounded-md shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label
                                    htmlFor="contactNumber"
                                    className="text-sm font-medium text-gray-800"
                                >
                                    Contact Number*
                                </Label>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    value={formData.contactNumber}
                                    onChange={e =>
                                        handleInputChange(
                                            "contactNumber",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-12 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="space-y-3">
                                <Label
                                    htmlFor="organization"
                                    className="text-sm font-medium text-gray-800"
                                >
                                    Organization / Company
                                </Label>
                                <Input
                                    id="organization"
                                    type="text"
                                    value={formData.organization}
                                    onChange={e =>
                                        handleInputChange(
                                            "organization",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-12 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white rounded-md shadow-sm"
                                />
                            </div>
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
                                    onChange={e =>
                                        handleInputChange(
                                            "message",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full h-32 px-4 py-3 text-base border border-gray-300 focus:ring-2 focus:ring-[#a5cd39] focus:border-[#a5cd39] bg-white resize-none rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={e =>
                                        setAgreedToTerms(e.target.checked)
                                    }
                                    className="mt-1 w-4 h-4 text-[#a5cd39] border-gray-300 rounded focus:ring-2 focus:ring-[#a5cd39]"
                                    required
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-600 leading-relaxed"
                                >
                                    By clicking submit, you agree to our{" "}
                                    <a
                                        href="#"
                                        className="text-[#a5cd39] hover:underline font-medium"
                                    >
                                        Terms and Conditions
                                    </a>
                                </label>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-500">
                                *Required Fields
                            </p>
                        </div>

                        <div className="text-right">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !agreedToTerms}
                                className="bg-[#007bff] hover:bg-[#0056b3] text-white px-8 py-3 text-sm font-medium transition-all duration-300 rounded-md uppercase tracking-wide shadow-md hover:shadow-lg"
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
                        </div>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
