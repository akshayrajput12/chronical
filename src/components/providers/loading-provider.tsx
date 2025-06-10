"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import LogoLoader from "@/components/ui/logo-loader";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    showLoader: (message?: string) => void;
    hideLoader: () => void;
    message: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

interface LoadingProviderProps {
    children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
    children,
}) => {
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [message, setMessage] = useState("Loading...");
    const pathname = usePathname();

    // Show loader with custom message
    const showLoader = (customMessage?: string) => {
        setMessage(customMessage || "Loading...");
        setIsLoading(true);
    };

    // Hide loader
    const hideLoader = () => {
        setIsLoading(false);
    };

    // Handle initial page load
    useEffect(() => {
        // Hide initial HTML loader first
        const initialLoader = document.getElementById("initial-loader");
        if (initialLoader) {
            setTimeout(() => {
                initialLoader.style.opacity = "0";
                setTimeout(() => {
                    initialLoader.style.display = "none";
                }, 300);
            }, 1500);
        }

        // Show React loader for additional loading
        setIsLoading(true);
        setMessage("Loading Chronicle Exhibits...");

        // Hide React loader after content is ready
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // Show for 2.5 seconds total

        return () => clearTimeout(timer);
    }, []);

    // Handle route changes
    useEffect(() => {
        // Show loader on route change
        setIsLoading(true);
        setMessage("Loading page...");

        // Hide loader after a short delay to allow page to load
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Listen for page load events
    useEffect(() => {
        const handleLoad = () => {
            // Ensure loader is hidden when page is fully loaded
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        const handleBeforeUnload = () => {
            // Show loader when navigating away
            setIsLoading(true);
            setMessage("Loading...");
        };

        // Add event listeners
        window.addEventListener("load", handleLoad);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Check if page is already loaded
        if (document.readyState === "complete") {
            handleLoad();
        }

        return () => {
            window.removeEventListener("load", handleLoad);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const contextValue: LoadingContextType = {
        isLoading,
        setIsLoading,
        showLoader,
        hideLoader,
        message,
    };

    return (
        <LoadingContext.Provider value={contextValue}>
            <LogoLoader isVisible={isLoading} message={message} />
            {children}
        </LoadingContext.Provider>
    );
};
