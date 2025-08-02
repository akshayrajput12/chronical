import React from "react";
import { PrivacyPolicy } from "@/types/privacy-policy";

interface PrivacyPolicyContentProps {
    privacyPolicy: PrivacyPolicy;
}

const PrivacyPolicyContent: React.FC<PrivacyPolicyContentProps> = ({
    privacyPolicy,
}) => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {privacyPolicy.title}
                </h1>
                <p className="text-gray-600">
                    Last updated: {new Date(privacyPolicy.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <div
                    className="privacy-policy-content"
                    dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
                />
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Questions About This Privacy Policy?
                </h2>
                <p className="text-gray-700 mb-2">
                    If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="text-gray-700">
                    <p>
                        <strong>Email:</strong>{" "}
                        <a
                            href={`mailto:${privacyPolicy.contact_email}`}
                            className="text-[#a5cd39] hover:text-[#8fb32e] transition-colors"
                        >
                            {privacyPolicy.contact_email}
                        </a>
                    </p>
                </div>
            </div>

            {/* Version Information */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Privacy Policy Version {privacyPolicy.version}</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyContent;
