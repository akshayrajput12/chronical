"use client";

import React, { useState } from "react";
import { useMinimalLoader, useDataLoading } from "@/hooks/use-minimal-loading";
import { Button } from "@/components/ui/button";

export default function MinimalLoaderDemoPage() {
    const {
        showLoader,
        showInlineLoader,
        showCenterLoader,
        hideLoader,
        isLoading,
    } = useMinimalLoader();
    const { fetchWithLoading } = useDataLoading();
    const [data, setData] = useState<string | null>(null);

    // Simulate data fetching
    const simulateDataFetch = async (delay: number = 2000) => {
        const result = await fetchWithLoading(
            () =>
                new Promise<string>(resolve =>
                    setTimeout(
                        () =>
                            resolve(
                                `Data loaded at ${new Date().toLocaleTimeString()}`,
                            ),
                        delay,
                    ),
                ),
            "Fetching data...",
        );
        setData(result);
    };

    const simulateQuickAction = async () => {
        showLoader("Processing...", { size: "tiny", showMessage: false });
        await new Promise(resolve => setTimeout(resolve, 1000));
        hideLoader();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        Minimal Loader Demo
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Test the minimal, non-intrusive loader that
                                doesn&apos;t block the entire screen.
                            </p>
                        </div>

                        {/* Position Demos */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Position Demos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button
                                    onClick={() => {
                                        showLoader("Top Right", {
                                            position: "top-right",
                                            showMessage: false,
                                        });
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Top Right
                                </Button>

                                <Button
                                    onClick={() => {
                                        showLoader("Bottom Right", {
                                            position: "bottom-right",
                                            showMessage: false,
                                        });
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Bottom Right
                                </Button>

                                <Button
                                    onClick={() => {
                                        showCenterLoader("Center with message");
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Center
                                </Button>

                                <Button
                                    onClick={() => {
                                        showInlineLoader("Inline loader");
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    Inline
                                </Button>
                            </div>
                        </div>

                        {/* Size Demos */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Size Demos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => {
                                        showLoader("Tiny loader", {
                                            size: "tiny",
                                            position: "top-right",
                                        });
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-pink-600 hover:bg-pink-700 text-white"
                                >
                                    Tiny Size
                                </Button>

                                <Button
                                    onClick={() => {
                                        showLoader("Small loader", {
                                            size: "small",
                                            position: "top-right",
                                        });
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    Small Size
                                </Button>

                                <Button
                                    onClick={() => {
                                        showLoader("Medium loader", {
                                            size: "medium",
                                            position: "center",
                                            showMessage: true,
                                        });
                                        setTimeout(hideLoader, 3000);
                                    }}
                                    disabled={isLoading}
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    Medium Size
                                </Button>
                            </div>
                        </div>

                        {/* Data Loading Demo */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Data Loading Demo
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={() => simulateDataFetch(1500)}
                                    disabled={isLoading}
                                    className="bg-[#a5cd39] hover:bg-[#94b933] text-white"
                                >
                                    Fetch Data (1.5s)
                                </Button>

                                <Button
                                    onClick={simulateQuickAction}
                                    disabled={isLoading}
                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                >
                                    Quick Action (1s)
                                </Button>
                            </div>

                            {data && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-800">✅ {data}</p>
                                </div>
                            )}
                        </div>

                        {/* Manual Control */}
                        <div className="text-center pt-4">
                            <Button
                                onClick={hideLoader}
                                disabled={!isLoading}
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                                Hide Loader
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Minimal Loader Features:
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>✅ Small, non-intrusive design</li>
                                <li>✅ Doesn&apos;t block the entire screen</li>
                                <li>
                                    ✅ Multiple size options (tiny, small,
                                    medium)
                                </li>
                                <li>
                                    ✅ Flexible positioning (corners, center,
                                    inline)
                                </li>
                                <li>✅ Optional loading messages</li>
                                <li>✅ Smooth animations</li>
                                <li>
                                    ✅ Perfect for data loading without blank
                                    screens
                                </li>
                                <li>
                                    ✅ Uses website logo for brand consistency
                                </li>
                            </ul>
                        </div>

                        {/* Usage Examples */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">
                                Usage Examples:
                            </h3>
                            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                                {`// For component loading (doesn't block screen)
import { useComponentLoading } from "@/hooks/use-minimal-loading";

const [loading, setLoading] = useState(true);
useComponentLoading(loading, "Loading data...");

// For manual control
const { showLoader, hideLoader } = useMinimalLoader();
showLoader("Processing...", { size: "small", position: "top-right" });

// For data fetching
const { fetchWithLoading } = useDataLoading();
const data = await fetchWithLoading(fetchData, "Loading...");`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
