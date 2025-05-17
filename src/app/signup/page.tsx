"use client";

import { useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect to admin dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/admin");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to access the Chronicle Exhibits admin panel
          </p>
        </div>
        <div className="mt-8">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-[#a5cd39] hover:bg-[#94b933] text-white",
                card: "shadow-md rounded-lg",
              },
            }}
            redirectUrl="/admin"
          />
        </div>
      </div>
    </div>
  );
}
