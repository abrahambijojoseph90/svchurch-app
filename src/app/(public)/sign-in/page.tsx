"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/my-posts";
  const [loading, setLoading] = useState(false);
  const errorParam = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-32 md:py-40 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-6">
            Welcome
          </p>
          <h1 className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
            Join Our Community
          </h1>
          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      {/* Sign In Form */}
      <section className="bg-[#faf8f5] py-16 md:py-24">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo.png"
                alt="Spring Valley Church"
                width={70}
                height={70}
                className="object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-sm text-center text-gray-500 mb-8">
              Sign in to write blogs and share your story with our church community.
            </p>

            {errorParam && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
                {errorParam === "OAuthAccountNotLinked"
                  ? "This email is already associated with a different sign-in method."
                  : "Something went wrong. Please try again."}
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                By signing in, you agree to our{" "}
                <Link href="/privacy-policy" className="text-[#ab815a] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Admin Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Church admin?{" "}
                <Link
                  href="/admin-login"
                  className="text-[#ab815a] font-medium hover:text-[#f16923] transition-colors"
                >
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1e232b]" />}>
      <SignInContent />
    </Suspense>
  );
}
