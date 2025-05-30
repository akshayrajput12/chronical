'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      setMessage('Check your email for the password reset link');
      setEmail('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending the reset link';
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Reset Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <motion.div
          className="max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <Image
              src="/logo.png"
              alt="Chronicle Exhibits Logo"
              width={180}
              height={60}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleResetPassword}
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#a5cd39] focus:border-[#a5cd39] transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#a5cd39] hover:bg-[#94b933] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a5cd39] transition-all duration-200 font-medium"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </div>
                ) : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/login" className="font-medium text-[#a5cd39] hover:text-[#94b933] transition-colors">
                  Sign in
                </Link>
              </p>
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
            <h2 className="text-3xl font-bold mb-6">Password Recovery</h2>
            <p className="text-lg mb-8">
              We&apos;ll help you get back into your account safely and securely.
            </p>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-3">Next Steps</h3>
              <ol className="text-left space-y-4 list-decimal list-inside">
                <li className="pl-2">
                  <span className="font-medium">Check your email</span>
                  <p className="text-sm mt-1">We&apos;ll send a secure link to reset your password</p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Click the link</span>
                  <p className="text-sm mt-1">Open the email and click the password reset link</p>
                </li>
                <li className="pl-2">
                  <span className="font-medium">Create a new password</span>
                  <p className="text-sm mt-1">Choose a strong, unique password for your account</p>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
