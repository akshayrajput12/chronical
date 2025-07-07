"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    showDetails?: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            const { fallback: Fallback } = this.props;
            
            if (Fallback && this.state.error) {
                return <Fallback error={this.state.error} retry={this.handleRetry} />;
            }

            return (
                <DefaultErrorFallback 
                    error={this.state.error} 
                    retry={this.handleRetry}
                    showDetails={this.props.showDetails}
                />
            );
        }

        return this.props.children;
    }
}

interface DefaultErrorFallbackProps {
    error?: Error;
    retry: () => void;
    showDetails?: boolean;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ 
    error, 
    retry, 
    showDetails = false 
}) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="mb-4">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-gray-600 mb-6">
                        We encountered an error while loading this page. This might be a temporary issue.
                    </p>
                </div>

                {showDetails && error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                        <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                        <p className="text-sm text-red-700 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Button 
                        onClick={retry}
                        className="w-full bg-[#a5cd39] hover:bg-[#8fb82e] text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    
                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full">
                            <Home className="w-4 h-4 mr-2" />
                            Go to Homepage
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    If this problem persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

// Hook for functional components
export const useErrorHandler = () => {
    const [error, setError] = React.useState<Error | null>(null);

    const handleError = React.useCallback((error: Error) => {
        console.error("Error handled:", error);
        setError(error);
    }, []);

    const clearError = React.useCallback(() => {
        setError(null);
    }, []);

    return { error, handleError, clearError };
};

// Higher-order component for wrapping pages
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );
    
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    
    return WrappedComponent;
};

export default ErrorBoundary;
