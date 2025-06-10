"use client";

import React from "react";
import { useInitialLoading } from "@/components/providers/initial-loading-provider";
import { Button } from "@/components/ui/button";

export default function InitialLoaderDemoPage() {
    const { isInitialLoading, setIsInitialLoading } = useInitialLoading();

    const showInitialLoader = () => {
        setIsInitialLoading(true);
        // Auto hide after 3 seconds
        setTimeout(() => {
            setIsInitialLoading(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        Initial Loader Demo
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Test the initial website loader that appears
                                when the site first loads.
                            </p>

                            <Button
                                onClick={showInitialLoader}
                                disabled={isInitialLoading}
                                className="bg-[#a5cd39] hover:bg-[#94b933] text-white"
                            >
                                {isInitialLoading
                                    ? "Loading..."
                                    : "Show Initial Loader"}
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Initial Loader Features:
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    ✅ Appears immediately when website loads
                                </li>
                                <li>✅ Small, round logo design</li>
                                <li>✅ Simple spinning ring animation</li>
                                <li>✅ Clean white background</li>
                                <li>✅ Gentle pulse animation on logo</li>
                                <li>✅ Covers entire screen initially</li>
                                <li>✅ Smooth fade out transition</li>
                                <li>✅ Prevents flash of unstyled content</li>
                            </ul>
                        </div>

                        {/* Technical Details */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">
                                How It Works:
                            </h3>
                            <div className="space-y-3 text-sm text-blue-700">
                                <div>
                                    <strong>1. HTML Loader:</strong> Shows
                                    immediately in the HTML before React loads
                                </div>
                                <div>
                                    <strong>2. React Takeover:</strong> React
                                    loader replaces HTML loader seamlessly
                                </div>
                                <div>
                                    <strong>3. Content Ready:</strong> Loader
                                    fades out when page is fully loaded
                                </div>
                                <div>
                                    <strong>4. Minimum Time:</strong> Shows for
                                    at least 1.2 seconds for smooth UX
                                </div>
                            </div>
                        </div>

                        {/* Design Specs */}
                        <div className="bg-green-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-green-800">
                                Design Specifications:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                                <div>
                                    <strong>Logo Container:</strong>
                                    <ul className="mt-1 space-y-1">
                                        <li>• 64px × 64px round container</li>
                                        <li>• White background</li>
                                        <li>• Subtle shadow</li>
                                        <li>• 48px logo inside</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong>Spinning Ring:</strong>
                                    <ul className="mt-1 space-y-1">
                                        <li>• 96px diameter</li>
                                        <li>• 2px border width</li>
                                        <li>
                                            • Chronicle green color (#a5cd39)
                                        </li>
                                        <li>• 2 second rotation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Usage */}
                        <div className="bg-purple-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-purple-800">
                                Usage:
                            </h3>
                            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                                {`// The loader is automatically active on website load
// No additional setup needed!

// To manually control (for testing):
import { useInitialLoading } from "@/components/providers/initial-loading-provider";

const { isInitialLoading, setIsInitialLoading } = useInitialLoading();

// Show loader
setIsInitialLoading(true);

// Hide loader
setIsInitialLoading(false);`}
                            </pre>
                        </div>

                        {/* Browser Test */}
                        <div className="bg-yellow-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
                                Test Instructions:
                            </h3>
                            <ol className="space-y-2 text-yellow-700">
                                <li>
                                    1. <strong>Hard Refresh:</strong> Press
                                    Ctrl+Shift+R (or Cmd+Shift+R on Mac)
                                </li>
                                <li>
                                    2. <strong>Clear Cache:</strong> Open
                                    DevTools → Application → Clear Storage
                                </li>
                                <li>
                                    3. <strong>Slow Network:</strong> DevTools →
                                    Network → Slow 3G
                                </li>
                                <li>
                                    4. <strong>Disable Cache:</strong> DevTools
                                    → Network → Disable cache
                                </li>
                                <li>
                                    5. <strong>Incognito Mode:</strong> Test in
                                    private browsing window
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
