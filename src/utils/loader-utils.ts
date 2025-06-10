/**
 * Utility functions for managing loading states across the application
 */

export interface LoadingConfig {
  message?: string;
  minDuration?: number; // Minimum time to show loader (in ms)
  maxDuration?: number; // Maximum time to show loader (in ms)
}

/**
 * Creates a promise that resolves after a minimum duration
 * Useful for ensuring loader is visible for a minimum time
 */
export const withMinimumDuration = async <T>(
  promise: Promise<T>,
  minDuration: number = 1000
): Promise<T> => {
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minDuration))
  ]);
  return result;
};

/**
 * Creates a timeout promise that rejects after maxDuration
 * Useful for preventing infinite loading states
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  maxDuration: number = 30000,
  timeoutMessage: string = "Operation timed out"
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(timeoutMessage)), maxDuration)
  );

  return Promise.race([promise, timeoutPromise]);
};

/**
 * Combines minimum duration and timeout for robust loading
 */
export const withLoadingConstraints = async <T>(
  promise: Promise<T>,
  config: LoadingConfig = {}
): Promise<T> => {
  const {
    minDuration = 1000,
    maxDuration = 30000
  } = config;

  let constrainedPromise = promise;

  // Add timeout if specified
  if (maxDuration > 0) {
    constrainedPromise = withTimeout(
      constrainedPromise,
      maxDuration,
      "Loading timed out. Please try again."
    );
  }

  // Add minimum duration if specified
  if (minDuration > 0) {
    constrainedPromise = withMinimumDuration(constrainedPromise, minDuration);
  }

  return constrainedPromise;
};

/**
 * Common loading messages for different contexts
 */
export const LoadingMessages = {
  // General
  DEFAULT: "Loading...",
  INITIALIZING: "Initializing Chronicle Exhibits...",
  
  // Data loading
  FETCHING_DATA: "Fetching data...",
  LOADING_CONTENT: "Loading content...",
  UPDATING_DATA: "Updating data...",
  SAVING_CHANGES: "Saving changes...",
  
  // Page specific
  LOADING_HERO: "Loading hero section...",
  LOADING_PORTFOLIO: "Loading portfolio...",
  LOADING_EXHIBITIONS: "Loading exhibitions...",
  LOADING_EVENTS: "Loading events...",
  LOADING_BLOG: "Loading blog posts...",
  
  // Actions
  PROCESSING: "Processing...",
  UPLOADING: "Uploading files...",
  DOWNLOADING: "Downloading...",
  GENERATING: "Generating content...",
  
  // Authentication
  SIGNING_IN: "Signing in...",
  SIGNING_OUT: "Signing out...",
  VERIFYING: "Verifying credentials...",
  
  // Navigation
  NAVIGATING: "Loading page...",
  REDIRECTING: "Redirecting...",
} as const;

/**
 * Predefined loading configurations for common scenarios
 */
export const LoadingConfigs = {
  // Quick operations (form submissions, etc.)
  QUICK: {
    minDuration: 500,
    maxDuration: 10000,
  },
  
  // Standard operations (data fetching, etc.)
  STANDARD: {
    minDuration: 1000,
    maxDuration: 30000,
  },
  
  // Long operations (file uploads, etc.)
  LONG: {
    minDuration: 1500,
    maxDuration: 60000,
  },
  
  // Critical operations (authentication, etc.)
  CRITICAL: {
    minDuration: 800,
    maxDuration: 15000,
  },
} as const;

/**
 * Helper function to create a loading wrapper for async operations
 */
export const createLoadingWrapper = (
  showLoader: (message?: string) => void,
  hideLoader: () => void
) => {
  return async <T>(
    operation: () => Promise<T>,
    config: LoadingConfig = {}
  ): Promise<T> => {
    const { message = LoadingMessages.DEFAULT } = config;
    
    try {
      showLoader(message);
      return await withLoadingConstraints(operation(), config);
    } finally {
      hideLoader();
    }
  };
};

/**
 * Debounced loading state to prevent flickering on fast operations
 */
export const createDebouncedLoader = (
  showLoader: (message?: string) => void,
  hideLoader: () => void,
  debounceMs: number = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let isShowing = false;

  const show = (message?: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!isShowing) {
      timeoutId = setTimeout(() => {
        showLoader(message);
        isShowing = true;
        timeoutId = null;
      }, debounceMs);
    }
  };

  const hide = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (isShowing) {
      hideLoader();
      isShowing = false;
    }
  };

  return { show, hide };
};
