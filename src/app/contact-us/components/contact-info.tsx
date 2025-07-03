"use client";

import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ContactGroupCompany } from "@/types/contact";

function formatPhoneHref(phone: string) {
    // Remove spaces, parentheses, and dashes for tel: links
    return phone.replace(/[\s()-]/g, "");
}

interface ContactInfoProps {
    groupCompanies: ContactGroupCompany[];
}

const ContactInfo: React.FC<ContactInfoProps> = ({ groupCompanies }) => {
    if (groupCompanies.length === 0) {
        return (
            <section className="bg-[#101e36] py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <p>No group companies available at the moment.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#101e36] py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl text-center text-white font-rubik font-bold mb-1">
                    GROUP COMPANIES
                </h2>
                <div className="flex !mb-2 justify-center">
                    <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {groupCompanies.map(company => (
                        <div
                            key={company.id}
                            className="bg-white shadow-lg p-8 border-t-4 border-[#a5cd39] flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{company.region}</h3>
                            <div className="text-gray-500 mb-4">
                                {company.address.split(',').map((line, index) => (
                                    <span key={index}>
                                        {line.trim()}
                                        {index < company.address.split(',').length - 1 && <br />}
                                    </span>
                                ))}
                            </div>
                            <div className="mb-2 flex items-center gap-2 text-gray-900">
                                <PhoneCall className="w-4 h-4" />
                                <Link
                                    href={`tel:${formatPhoneHref(company.phone)}`}
                                    className="font-semibold hover:text-[#a5cd39] transition-colors"
                                >
                                    {company.phone}
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 text-gray-900">
                                <Mail className="w-4 h-4" />
                                <Link
                                    href={`mailto:${company.email}`}
                                    className="font-semibold hover:text-[#a5cd39] transition-colors"
                                >
                                    {company.email}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactInfo;
