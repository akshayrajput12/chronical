"use client";

import { useEffect, useCallback } from "react";
import { useMinimalLoading } from "@/components/providers/minimal-loading-provider";

interface LoaderOptions {
    size?: "tiny" | "small" | "medium";
    position?: "center" | "top-right" | "bottom-right" | "inline";
    showMessage?: boolean;
    persistent?: boolean;
}

/**
 * Hook to manage component loading states with minimal loader
 * @param isLoading - Whether the component is currently loading
 * @param message - Custom loading message
 */
export const useComponentLoading = (isLoading: boolean, message?: string) => {
    const { showLoader, hideLoader } = useMinimalLoading();

    useEffect(() => {
        if (isLoading) {
            showLoader(message, {
                size: "small",
                position: "top-right",
                showMessage: false,
                persistent: true, // Don't auto-hide on route changes
            });
        } else {
            hideLoader();
        }
        // Remove showLoader and hideLoader from dependencies to prevent infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, message]);
};

/**
 * Hook to manually control the minimal loader
 */
export const useMinimalLoader = () => {
    const { showLoader, hideLoader, isLoading } = useMinimalLoading();

    const showMinimalLoader = (message?: string, options?: LoaderOptions) => {
        showLoader(message, {
            size: "small",
            position: "top-right",
            showMessage: false,
            ...options,
        });
    };

    const showInlineLoader = (message?: string) => {
        showLoader(message, {
            size: "small",
            position: "inline",
            showMessage: true,
            persistent: true,
        });
    };

    const showCenterLoader = (message?: string) => {
        showLoader(message, {
            size: "medium",
            position: "center",
            showMessage: true,
            persistent: true,
        });
    };

    return {
        showLoader: showMinimalLoader,
        showInlineLoader,
        showCenterLoader,
        hideLoader,
        isLoading,
    };
};

/**
 * Hook for data fetching with automatic loading state
 */
export const useDataLoading = () => {
    const { showLoader, hideLoader } = useMinimalLoading();

    const fetchWithLoading = async <T>(
        fetchFunction: () => Promise<T>,
        message: string = "Loading data...",
        options?: LoaderOptions,
    ): Promise<T> => {
        try {
            showLoader(message, {
                size: "small",
                position: "top-right",
                showMessage: false,
                persistent: true,
                ...options,
            });

            const result = await fetchFunction();
            return result;
        } finally {
            hideLoader();
        }
    };

    return { fetchWithLoading };
};
