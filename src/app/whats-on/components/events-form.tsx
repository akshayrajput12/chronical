import React, { useState } from "react";

export const EventsForm = () => {
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

    // Handler for file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            file,
        }));
    };
    return (
        <section className="py-16 bg-black/60">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-rubik font-bold text-center text-white mb-4">
                    Event Gallery
                    <div className="w-16 h-1 my-2 bg-[#a5cd39] mx-auto"></div>
                </h2>

                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
                    <form className="space-y-4">
                        {/* Simple responsive grid for all main fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Exhibition Name"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Company Name"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone (with country code)"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Budget"
                                className="h-8 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200"
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
                                />
                                <div className="flex items-center justify-between w-full h-10 px-1 pl-2 py-2 text-sm bg-white border border-gray-300 hover:border-[#a5cd39] focus-within:border-[#a5cd39] rounded-md cursor-pointer transition-all duration-200">
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
                        {/* Textarea full width */}
                        <div>
                            <textarea
                                placeholder="Describe your booth requirements, design preferences, special features, or any specific customizations you need..."
                                className="min-h-[40px] h-16 px-2 py-1 text-xs border border-gray-300 rounded-md w-full focus:border-[#a5cd39] focus:ring-1 focus:ring-[#a5cd39] placeholder:text-gray-500 transition-all duration-200 resize-none"
                                required
                            />
                        </div>
                        {/* Submit button centered */}
                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                className="bg-[#a5cd39] text-white px-6 py-2 rounded-md font-medium hover:bg-[#94b933] transition-colors duration-300 uppercase font-noto-kufi-arabic text-sm"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};
