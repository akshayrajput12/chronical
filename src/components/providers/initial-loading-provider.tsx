"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import InitialLoader from "@/components/ui/initial-loader";

interface InitialLoadingContextType {
    isInitialLoading: boolean;
    setIsInitialLoading: (loading: boolean) => void;
}

const InitialLoadingContext = createContext<
    InitialLoadingContextType | undefined
>(undefined);

export const useInitialLoading = () => {
    const context = useContext(InitialLoadingContext);
    if (!context) {
        throw new Error(
            "useInitialLoading must be used within an InitialLoadingProvider",
        );
    }
    return context;
};

interface InitialLoadingProviderProps {
    children: ReactNode;
}

export const InitialLoadingProvider: React.FC<InitialLoadingProviderProps> = ({
    children,
}) => {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        // Hide HTML loader immediately when React loads
        const htmlLoader = document.getElementById("html-initial-loader");
        if (htmlLoader) {
            htmlLoader.style.display = "none";
        }

        // Enable scrolling
        document.documentElement.classList.add("loaded");
        document.body.classList.add("loaded");

        // Hide React loader after minimum time and when page is ready
        const minLoadTime = 1200; // Minimum 1.2 seconds
        const startTime = Date.now();

        const hideLoader = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);

            setTimeout(() => {
                setIsInitialLoading(false);
            }, remainingTime);
        };

        // Wait for page to be fully loaded
        if (document.readyState === "complete") {
            hideLoader();
        } else {
            const handleLoad = () => {
                hideLoader();
                window.removeEventListener("load", handleLoad);
            };
            window.addEventListener("load", handleLoad);

            // Fallback timeout
            const fallbackTimeout = setTimeout(() => {
                hideLoader();
            }, 3000); // Maximum 3 seconds

            return () => {
                window.removeEventListener("load", handleLoad);
                clearTimeout(fallbackTimeout);
            };
        }
    }, []);

    const contextValue: InitialLoadingContextType = {
        isInitialLoading,
        setIsInitialLoading,
    };

    return (
        <InitialLoadingContext.Provider value={contextValue}>
            <InitialLoader isVisible={isInitialLoading} />
            {children}
        </InitialLoadingContext.Provider>
    );
};
