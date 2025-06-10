"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import MinimalLoader from "@/components/ui/minimal-loader";

interface MinimalLoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showLoader: (message?: string, options?: LoaderOptions) => void;
    hideLoader: () => void;
    message: string;
}

interface LoaderOptions {
    size?: "tiny" | "small" | "medium";
    position?: "center" | "top-right" | "bottom-right" | "inline";
    showMessage?: boolean;
    persistent?: boolean; // If true, won't auto-hide on route changes
}

const MinimalLoadingContext = createContext<
    MinimalLoadingContextType | undefined
>(undefined);

export const useMinimalLoading = () => {
    const context = useContext(MinimalLoadingContext);
    if (!context) {
        throw new Error(
            "useMinimalLoading must be used within a MinimalLoadingProvider",
        );
    }
    return context;
};

interface MinimalLoadingProviderProps {
    children: ReactNode;
}

export const MinimalLoadingProvider: React.FC<MinimalLoadingProviderProps> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false); // Start with false - no initial blocking
    const [message, setMessage] = useState("Loading...");
    const [loaderOptions, setLoaderOptions] = useState<LoaderOptions>({
        size: "small",
        position: "top-right",
        showMessage: false,
        persistent: false,
    });
    // Removed pathname since we're not using route change effects

    // Show loader with custom message and options
    const showLoader = (customMessage?: string, options?: LoaderOptions) => {
        setMessage(customMessage || "Loading...");
        setLoaderOptions({
            size: "small",
            position: "top-right",
            showMessage: false,
            persistent: false,
            ...options,
        });
        setIsLoading(true);
    };

    // Hide loader
    const hideLoader = () => {
        setIsLoading(false);
    };

    // Disable route change loading for now to prevent infinite loops
    // This can be re-enabled later with better state management
    // useEffect(() => {
    //     // Route change logic here
    // }, [pathname]);

    // Disable page load events for now to prevent conflicts
    // The initial loader handles the page load timing
    // useEffect(() => {
    //     // Page load logic here
    // }, []);

    const contextValue: MinimalLoadingContextType = {
        isLoading,
        setIsLoading,
        showLoader,
        hideLoader,
        message,
    };

    return (
        <MinimalLoadingContext.Provider value={contextValue}>
            <MinimalLoader
                isVisible={isLoading}
                message={message}
                size={loaderOptions.size}
                position={loaderOptions.position}
                showMessage={loaderOptions.showMessage}
            />
            {children}
        </MinimalLoadingContext.Provider>
    );
};
