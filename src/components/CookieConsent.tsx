"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "svc-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't consented yet
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-[#1e232b] text-white shadow-2xl border border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <h3 className="font-[family-name:var(--font-cinzel)] text-[#ab815a] text-base font-semibold">
              Cookie Notice
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              We use essential cookies to keep our site working (e.g. authentication sessions).
              We do not use tracking or advertising cookies. By continuing to use this site, you
              consent to our use of essential cookies.{" "}
              <Link
                href="/privacy-policy"
                className="text-[#ab815a] underline underline-offset-2 hover:text-[#c9a882] transition-colors"
              >
                Read our Privacy Policy
              </Link>
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={accept}
                className="px-5 py-2 bg-[#ab815a] hover:bg-[#8a6744] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium rounded-lg transition-colors"
              >
                Decline Non-Essential
              </button>
            </div>
          </div>
          <button
            onClick={decline}
            aria-label="Close cookie notice"
            className="text-white/40 hover:text-white/80 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
