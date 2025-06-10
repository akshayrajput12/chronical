"use client";

import React, { useState } from "react";
import { useGlobalLoader } from "@/hooks/use-page-loading";
import { Button } from "@/components/ui/button";
import {
    LoadingMessages,
    LoadingConfigs,
    createLoadingWrapper,
    withMinimumDuration,
} from "@/utils/loader-utils";

export default function LoaderDemoPage() {
    const { showLoader, hideLoader, isLoading } = useGlobalLoader();
    const [loadingTime, setLoadingTime] = useState(3);

    // Create a loading wrapper for demo operations
    const loadingWrapper = createLoadingWrapper(showLoader, hideLoader);

    const handleShowLoader = (message?: string) => {
        showLoader(message);

        // Auto hide after specified time
        setTimeout(() => {
            hideLoader();
        }, loadingTime * 1000);
    };

    const simulateDataFetch = async (
        message: string,
        config = LoadingConfigs.STANDARD,
    ) => {
        await loadingWrapper(
            () =>
                withMinimumDuration(
                    new Promise(resolve =>
                        setTimeout(resolve, Math.random() * 2000 + 1000),
                    ),
                    config.minDuration || 1000,
                ),
            { message, ...config },
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        Logo Loader Demo
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                Test the animated logo loader with different
                                messages and durations.
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loading Duration (seconds)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={loadingTime}
                                    onChange={e =>
                                        setLoadingTime(Number(e.target.value))
                                    }
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                onClick={() => handleShowLoader()}
                                disabled={isLoading}
                                className="bg-[#a5cd39] hover:bg-[#94b933] text-white"
                            >
                                Show Default Loader
                            </Button>

                            <Button
                                onClick={() =>
                                    handleShowLoader(
                                        "Loading Chronicle Exhibits...",
                                    )
                                }
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Show Custom Message
                            </Button>

                            <Button
                                onClick={() =>
                                    handleShowLoader(
                                        "Fetching exhibition data...",
                                    )
                                }
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Show Data Loading
                            </Button>

                            <Button
                                onClick={() =>
                                    handleShowLoader(
                                        "Preparing your experience...",
                                    )
                                }
                                disabled={isLoading}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                Show Experience Loading
                            </Button>
                        </div>

                        <div className="text-center pt-4">
                            <Button
                                onClick={hideLoader}
                                disabled={!isLoading}
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                                Hide Loader Immediately
                            </Button>
                        </div>

                        {/* Advanced Demos Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Advanced Loading Utilities:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.FETCHING_DATA,
                                            LoadingConfigs.QUICK,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                                >
                                    Quick Fetch (0.5s min)
                                </Button>

                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.LOADING_EXHIBITIONS,
                                            LoadingConfigs.STANDARD,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                                >
                                    Standard Load (1s min)
                                </Button>

                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.UPLOADING,
                                            LoadingConfigs.LONG,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                                >
                                    Long Operation (1.5s min)
                                </Button>

                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.PROCESSING,
                                            LoadingConfigs.CRITICAL,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                                >
                                    Critical Process
                                </Button>

                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.LOADING_PORTFOLIO,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-pink-600 hover:bg-pink-700 text-white text-sm"
                                >
                                    Portfolio Load
                                </Button>

                                <Button
                                    onClick={() =>
                                        simulateDataFetch(
                                            LoadingMessages.SAVING_CHANGES,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Loader Features:
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>
                                    • Animated logo with pulse, float, and glow
                                    effects
                                </li>
                                <li>• Spinning ring around the logo</li>
                                <li>• Pulsing secondary ring</li>
                                <li>• Animated loading dots</li>
                                <li>• Progress bar animation</li>
                                <li>• Smooth fade in/out transitions</li>
                                <li>
                                    • Responsive design for all screen sizes
                                </li>
                                <li>• Custom loading messages</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">
                                Usage in Components:
                            </h3>
                            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                                {`import { usePageLoading } from "@/hooks/use-page-loading";

// For automatic loading state management
const [loading, setLoading] = useState(true);
usePageLoading(loading, "Custom message...");

// For manual control
const { showLoader, hideLoader } = useGlobalLoader();
showLoader("Loading...");
hideLoader();`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
