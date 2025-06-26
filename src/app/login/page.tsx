"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Easing, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

// Component to handle search params
function LoginContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/admin";

    // Create Supabase client
    const supabase = createClient();

    // Rest of the component logic and UI
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut" as Easing | Easing[] | undefined,
            },
        },
    };

    // Check if user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                router.push(redirectTo);
            }
        };

        checkSession();
    }, [router, redirectTo, supabase.auth]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                router.push(redirectTo);
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An error occurred during login";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
                <motion.div
                    className="max-w-md w-full"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div
                        className="text-center mb-10"
                        variants={itemVariants}
                    >
                        <Image
                            src="/logo.png"
                            alt="Chronicle Exhibits Logo"
                            width={180}
                            height={60}
                            className="mx-auto mb-6"
                        />
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Sign in to access your admin dashboard
                        </p>
                    </motion.div>

                    <motion.form
                        className="space-y-6"
                        onSubmit={handleLogin}
                        variants={itemVariants}
                    >
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700">
                                <p className="font-medium">
                                    Authentication Error
                                </p>
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#a5cd39] focus:border-[#a5cd39] transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#a5cd39] focus:border-[#a5cd39] transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#a5cd39] focus:ring-[#a5cd39] border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link
                                    href="/reset-password"
                                    className="font-medium text-[#a5cd39] hover:text-[#94b933] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#a5cd39] hover:bg-[#94b933] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a5cd39] transition-all duration-200 font-medium"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>

            {/* Right side - Image and Info */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#a5cd39] to-[#8baa2f] p-8 md:p-16">
                <div className="h-full flex flex-col justify-center">
                    <motion.div
                        className="text-white mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            Welcome to Chronicle Exhibits Admin
                        </h2>
                        <p className="text-lg opacity-90">
                            Manage your exhibition content, kiosks, and user
                            accounts from this central dashboard.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white/20 backdrop-blur-sm p-6 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <h3 className="font-semibold text-xl mb-3 text-white">
                            Admin Features
                        </h3>
                        <ul className="text-white space-y-3">
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 mr-2 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span>Manage exhibition content and media</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 mr-2 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span>
                                    Configure kiosk displays and interactions
                                </span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    className="h-6 w-6 mr-2 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span>
                                    View analytics and user engagement data
                                </span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[#a5cd39] border-t-transparent rounded-full"></div>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
