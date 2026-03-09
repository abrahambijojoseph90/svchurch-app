import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1e232b] text-white">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-[url('/images/footer-bg.png')] bg-cover bg-center opacity-5 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Service Times */}
          <div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-[#ab815a] text-lg font-semibold tracking-wider uppercase mb-6">
              Join Us For
            </h3>
            <ul className="space-y-4 text-white/80 text-sm leading-relaxed">
              <li>
                <span className="block font-medium text-white">
                  Sunday Services
                </span>
                08:15 &ndash; 10:30
              </li>
              <li>
                <span className="block font-medium text-white">
                  Sunday School
                </span>
                11:00 &ndash; 12:00
              </li>
              <li>
                <span className="block font-medium text-white">
                  Friday Bible Study
                </span>
                08:00 &ndash; 10:00 PM
              </li>
            </ul>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image
                src="/images/logo-white.png"
                alt="Spring Valley Church"
                width={180}
                height={90}
                className="h-auto w-[180px] opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>

          {/* Address & Contact */}
          <div className="md:text-right">
            <h3 className="font-[family-name:var(--font-cinzel)] text-[#ab815a] text-lg font-semibold tracking-wider uppercase mb-6">
              Address
            </h3>
            <address className="not-italic text-white/80 text-sm leading-relaxed space-y-2">
              <p>49 High Town Rd</p>
              <p>Luton LU2 0BW</p>
              <p className="pt-2">
                <span className="text-white/60">Phone:</span>{" "}
                <a
                  href="tel:03300889669"
                  className="hover:text-[#ab815a] transition-colors"
                >
                  0330 088 9669
                </a>
              </p>
              <p>
                <span className="text-white/60">Email:</span>{" "}
                <a
                  href="mailto:admin@svchurch.co.uk"
                  className="hover:text-[#ab815a] transition-colors"
                >
                  admin@svchurch.co.uk
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-white/50 text-sm">
            <p>&copy; 2026 Spring Valley Church. All rights reserved.</p>
            <span className="hidden sm:inline">&middot;</span>
            <Link
              href="/privacy-policy"
              className="hover:text-[#ab815a] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white/50 hover:text-[#ab815a] transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-white/50 hover:text-[#ab815a] transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-white/50 hover:text-[#ab815a] transition-colors"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
