import { Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";

const companies = [
    {
        region: "Europe",
        address: (
            <>
                Zum see 7,
                <br />
                14542 Werder (Havel), Germany
            </>
        ),
        phone: "+49 (0) 33 2774 99-100",
        email: "enquiry@triumfo.de",
    },
    {
        region: "United States",
        address: (
            <>
                2782 Abels Ln,
                <br />
                Las Vegas, NV 89115, USA
            </>
        ),
        phone: "+1 702 992 0440",
        email: "enquiry@triumfo.us",
    },
    {
        region: "India",
        address: (
            <>
                A-65 Sector-83, Phase II,
                <br />
                Noida – 201305, India
            </>
        ),
        phone: "+91-0120-4690699",
        email: "enquiry@triumfo.in",
    },
];

function formatPhoneHref(phone: string) {
    // Remove spaces, parentheses, and dashes for tel: links
    return phone.replace(/[\s()-]/g, "");
}

const GroupCompanies = () => (
    <section className="bg-[#101e36] py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl text-center text-white font-rubik font-bold mb-1">
                GROUP COMPANIES
            </h2>
            <div className="flex !mb-2 justify-center">
                <div className="h-1 bg-[#a5cd39] w-16 mt-1 mb-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {companies.map(c => (
                    <div
                        key={c.region}
                        className="bg-white shadow-lg p-8 border-t-4 border-[#a5cd39] flex flex-col h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                        <h3 className="mb-2">{c.region}</h3>
                        <div className="text-gray-500 mb-4">{c.address}</div>
                        <div className="mb-2 flex items-center gap-2 text-gray-900">
                            <PhoneCall className="w-4 h-4" />
                            <Link
                                href={`tel:${formatPhoneHref(c.phone)}`}
                                className="font-semibold hover:text-[#a5cd39] transition-colors"
                            >
                                {c.phone}
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900">
                            <Mail className="w-4 h-4" />
                            <Link
                                href={`mailto:${c.email}`}
                                className="font-semibold hover:text-[#a5cd39] transition-colors"
                            >
                                {c.email}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default GroupCompanies;
