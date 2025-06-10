"use client";

import { useEffect } from "react";
import { useLoading } from "@/components/providers/loading-provider";

/**
 * Hook to manage page loading states
 * @param isLoading - Whether the page/component is currently loading
 * @param message - Custom loading message
 */
export const usePageLoading = (isLoading: boolean, message?: string) => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoader(message);
    } else {
      hideLoader();
    }
  }, [isLoading, message, showLoader, hideLoader]);
};

/**
 * Hook to manually control the global loader
 */
export const useGlobalLoader = () => {
  const { showLoader, hideLoader, isLoading } = useLoading();

  return {
    showLoader,
    hideLoader,
    isLoading,
  };
};
