"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Easing, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const supabase = createClient();

    // Check if user is authenticated with a recovery token
    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            // If no user or no recovery token, redirect to login
            if (!user) {
                router.push("/login");
            }
        };

        checkSession();
    }, [router, supabase.auth]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                throw error;
            }

            setMessage(
                "Password updated successfully. Redirecting to login...",
            );

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An error occurred while updating your password";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Update Password Form */}
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
                            Update Your Password
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Create a new secure password for your account
                        </p>
                    </motion.div>

                    <motion.form
                        className="space-y-6"
                        onSubmit={handleUpdatePassword}
                        variants={itemVariants}
                    >
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700">
                                <p className="font-medium">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md text-sm text-green-700">
                                <p className="font-medium">Success</p>
                                <p>{message}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#a5cd39] focus:border-[#a5cd39] transition-all duration-200"
                                        placeholder="Enter new password"
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
                                <p className="mt-1 text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={e =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#a5cd39] focus:border-[#a5cd39] transition-all duration-200"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
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
                                        Updating password...
                                    </div>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>

            {/* Right side - Image/Branding */}
            <div className="hidden md:block md:w-1/2 bg-[#f8f9fa] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#a5cd39]/90 to-[#94b933]/80 z-10"></div>
                <div className="absolute inset-0 bg-[url('/images/home.jpg')] bg-cover bg-center z-0"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-12 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="max-w-md text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            Almost Done!
                        </h2>
                        <p className="text-lg mb-8">
                            Create a strong password to secure your account.
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
                            <h3 className="font-semibold text-xl mb-3">
                                Password Tips
                            </h3>
                            <ul className="text-left space-y-2">
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0"
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
                                    <span>Use at least 8 characters</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0"
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
                                        Include uppercase and lowercase letters
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0"
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
                                        Add numbers and special characters
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0"
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
                                        Avoid using personal information
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
