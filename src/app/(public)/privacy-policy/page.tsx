"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Mail, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  Reusable section heading                                           */
/* ------------------------------------------------------------------ */

function SectionHeading({
  number,
  title,
  customDelay = 0,
}: {
  number: string;
  title: string;
  customDelay?: number;
}) {
  return (
    <motion.h2
      variants={fadeUp}
      custom={customDelay}
      className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl text-[#1e232b] mb-6 flex items-baseline gap-3"
    >
      <span className="text-[#ab815a] font-[family-name:var(--font-cinzel)] text-lg">
        {number}.
      </span>
      {title}
    </motion.h2>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicyPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative bg-[#1e232b] py-28 md:py-36 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 via-[#1e232b]/80 to-[#1e232b]" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.3em] uppercase text-xs sm:text-sm font-medium mb-4"
          >
            Your Privacy Matters
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={0}
            className="w-12 h-[2px] bg-[#ab815a] mx-auto mb-6"
          />
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight"
          >
            Privacy Policy
          </motion.h1>
        </motion.div>
      </section>

      {/* ======================== INTRO ======================== */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-14 h-14 bg-[#ab815a]/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="w-6 h-6 text-[#ab815a]" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-lg sm:text-xl leading-relaxed mb-4"
            >
              Spring Valley Church is committed to protecting your personal data
              and respecting your privacy. This policy explains how we collect,
              use, and safeguard your information in accordance with the{" "}
              <strong className="text-[#1e232b]/90">
                UK General Data Protection Regulation (UK GDPR)
              </strong>{" "}
              and the{" "}
              <strong className="text-[#1e232b]/90">
                Data Protection Act 2018
              </strong>
              .
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-[#1e232b]/50 text-sm"
            >
              Last updated: 9 March 2026
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ======================== POLICY CONTENT ======================== */}
      <section className="bg-[#faf8f5] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* --- 1. Data Controller --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="1" title="Data Controller" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                The data controller responsible for your personal data is:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
                <p className="font-medium text-[#1e232b]">
                  Spring Valley Church
                </p>
                <p>49 High Town Rd, Luton LU2 0BW, Bedfordshire, UK</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                  <a
                    href="mailto:admin@svchurch.co.uk"
                    className="hover:text-[#ab815a] transition-colors"
                  >
                    admin@svchurch.co.uk
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                  <a
                    href="tel:03300889669"
                    className="hover:text-[#ab815a] transition-colors"
                  >
                    0330 088 9669
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* --- 2. What Data We Collect --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="2" title="What Data We Collect" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>We may collect the following personal data:</p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Contact form submissions:
                      </strong>{" "}
                      your name, email address, phone number (optional), and
                      message content when you use our contact form.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Admin user accounts:
                      </strong>{" "}
                      name, email address, and a securely hashed password for
                      authorised administrators who manage the website.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Session data:
                      </strong>{" "}
                      authentication session tokens stored in cookies (see
                      Section 5 below).
                    </span>
                  </li>
                </ul>
              </div>
              <p>
                We do not collect any special category (sensitive) data, nor do
                we collect data from children through this website.
              </p>
            </motion.div>
          </motion.div>

          {/* --- 3. Why We Collect Your Data --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="3"
              title="Why We Collect Your Data (Lawful Basis)"
            />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                Under UK GDPR, we must have a lawful basis for processing your
                personal data. We rely on the following:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">Consent</strong>{" "}
                      (Article 6(1)(a)) &mdash; when you voluntarily submit the
                      contact form, you consent to us processing your details to
                      respond to your enquiry.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Legitimate interests
                      </strong>{" "}
                      (Article 6(1)(f)) &mdash; to administer and secure our
                      website, including managing admin accounts and maintaining
                      session authentication.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* --- 4. How We Store and Protect Your Data --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="4"
              title="How We Store and Protect Your Data"
            />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                Your data is stored securely in a PostgreSQL database hosted by{" "}
                <strong className="text-[#1e232b]/90">Neon</strong> (cloud
                database provider) with encrypted connections. The website is
                hosted on{" "}
                <strong className="text-[#1e232b]/90">Vercel</strong>. Both
                providers maintain appropriate technical and organisational
                security measures.
              </p>
              <p>Key security measures include:</p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      All passwords are stored as cryptographically hashed
                      values &mdash; we never store passwords in plain text.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      All data transmitted between your browser and our website
                      is encrypted using HTTPS/TLS.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      Database connections are encrypted and access is restricted
                      to authorised services only.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      Admin access is protected by authenticated sessions with
                      limited lifetimes.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* --- 5. Cookies --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="5" title="Cookies" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                Our website uses only <strong className="text-[#1e232b]/90">strictly necessary cookies</strong>.
                We do not use any advertising, tracking, or analytics cookies.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1e232b]/10">
                      <th className="text-left py-3 pr-4 font-semibold text-[#1e232b]/90">
                        Cookie
                      </th>
                      <th className="text-left py-3 pr-4 font-semibold text-[#1e232b]/90">
                        Purpose
                      </th>
                      <th className="text-left py-3 font-semibold text-[#1e232b]/90">
                        Expiry
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-xs text-[#ab815a]">
                        next-auth.session-token
                      </td>
                      <td className="py-3 pr-4">
                        Authenticates admin users via a signed JWT. This cookie
                        is essential for the admin area to function and is only
                        set when an administrator logs in.
                      </td>
                      <td className="py-3 whitespace-nowrap">1 hour</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Because we only use strictly necessary cookies, no cookie
                consent banner is required under UK GDPR and the Privacy and
                Electronic Communications Regulations (PECR).
              </p>
            </motion.div>
          </motion.div>

          {/* --- 6. Third-Party Services --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="6" title="Third-Party Services" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                We use a limited number of third-party services. We do not sell
                or share your personal data with third parties for marketing
                purposes.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Google Maps (embed):
                      </strong>{" "}
                      Our contact page includes an embedded Google Map to show
                      our location. When this page loads, your browser may send
                      data (such as your IP address) to Google. This is governed
                      by{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ab815a] underline underline-offset-2 hover:text-[#8a6744] transition-colors"
                      >
                        Google&apos;s Privacy Policy
                      </a>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Google Fonts:
                      </strong>{" "}
                      Fonts are self-hosted via Next.js and served directly from
                      our domain. No requests are made to Google&apos;s servers
                      for font loading.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Vercel (hosting):
                      </strong>{" "}
                      Our website is hosted on Vercel, which may process
                      standard server logs (IP addresses, request timestamps).
                      See{" "}
                      <a
                        href="https://vercel.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ab815a] underline underline-offset-2 hover:text-[#8a6744] transition-colors"
                      >
                        Vercel&apos;s Privacy Policy
                      </a>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Neon (database):
                      </strong>{" "}
                      Our database is hosted by Neon. Your data is stored
                      securely and is not shared with other parties. See{" "}
                      <a
                        href="https://neon.tech/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ab815a] underline underline-offset-2 hover:text-[#8a6744] transition-colors"
                      >
                        Neon&apos;s Privacy Policy
                      </a>
                      .
                    </span>
                  </li>
                </ul>
              </div>
              <p>
                We do not currently use any third-party analytics, advertising,
                or tracking services.
              </p>
            </motion.div>
          </motion.div>

          {/* --- 7. Data Retention --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="7" title="Data Retention" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>We retain personal data only for as long as necessary:</p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Contact form submissions:
                      </strong>{" "}
                      retained for up to 12 months after your enquiry has been
                      resolved, then securely deleted.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Admin accounts:
                      </strong>{" "}
                      retained for the duration of the individual&apos;s role as
                      an administrator, then deleted upon removal of access.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Session cookies:
                      </strong>{" "}
                      automatically expire after 1 hour and are removed from
                      your browser.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* --- 8. Your Rights --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="8" title="Your Rights" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                Under UK GDPR, you have the following rights regarding your
                personal data:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right of access
                      </strong>{" "}
                      &mdash; you can request a copy of the personal data we
                      hold about you.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to rectification
                      </strong>{" "}
                      &mdash; you can ask us to correct inaccurate or incomplete
                      data.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to erasure
                      </strong>{" "}
                      &mdash; you can ask us to delete your personal data where
                      there is no compelling reason for us to continue
                      processing it.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to restrict processing
                      </strong>{" "}
                      &mdash; you can ask us to limit how we use your data.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to data portability
                      </strong>{" "}
                      &mdash; you can request your data in a structured,
                      commonly used, machine-readable format.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to object
                      </strong>{" "}
                      &mdash; you can object to processing based on legitimate
                      interests.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#ab815a] rounded-full mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-[#1e232b]/90">
                        Right to withdraw consent
                      </strong>{" "}
                      &mdash; where we rely on consent, you can withdraw it at
                      any time without affecting the lawfulness of prior
                      processing.
                    </span>
                  </li>
                </ul>
              </div>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:admin@svchurch.co.uk"
                  className="text-[#ab815a] underline underline-offset-2 hover:text-[#8a6744] transition-colors"
                >
                  admin@svchurch.co.uk
                </a>
                . We will respond to your request within one month, as required
                by law.
              </p>
            </motion.div>
          </motion.div>

          {/* --- 9. International Transfers --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="9" title="International Data Transfers" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                Some of our third-party service providers (Vercel, Neon, Google)
                may process data outside the UK. Where this occurs, we ensure
                that appropriate safeguards are in place, such as Standard
                Contractual Clauses or adequacy decisions, to protect your data
                in compliance with UK GDPR.
              </p>
            </motion.div>
          </motion.div>

          {/* --- 10. Complaints --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="10" title="Complaints" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                If you are unhappy with how we have handled your personal data,
                we encourage you to contact us first so that we can try to
                resolve the matter.
              </p>
              <p>
                You also have the right to lodge a complaint with the UK&apos;s
                supervisory authority:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
                <p className="font-medium text-[#1e232b]">
                  Information Commissioner&apos;s Office (ICO)
                </p>
                <p>Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
                <p>
                  Helpline:{" "}
                  <a
                    href="tel:03031231113"
                    className="hover:text-[#ab815a] transition-colors"
                  >
                    0303 123 1113
                  </a>
                </p>
                <p>
                  Website:{" "}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ab815a] underline underline-offset-2 hover:text-[#8a6744] transition-colors"
                  >
                    ico.org.uk
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* --- 11. Changes to This Policy --- */}
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading
              number="11"
              title="Changes to This Policy"
            />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                We may update this privacy policy from time to time. Any changes
                will be posted on this page with an updated revision date. We
                encourage you to review this page periodically.
              </p>
            </motion.div>
          </motion.div>

          {/* --- 12. Contact Us --- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            <SectionHeading number="12" title="Contact Us" />
            <motion.div
              variants={fadeUp}
              custom={1}
              className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed space-y-4"
            >
              <p>
                If you have any questions about this privacy policy or wish to
                exercise your data rights, please get in touch:
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
                <p className="font-medium text-[#1e232b]">
                  Spring Valley Church
                </p>
                <p>49 High Town Rd, Luton LU2 0BW, Bedfordshire, UK</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                  <a
                    href="mailto:admin@svchurch.co.uk"
                    className="hover:text-[#ab815a] transition-colors"
                  >
                    admin@svchurch.co.uk
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                  <a
                    href="tel:03300889669"
                    className="hover:text-[#ab815a] transition-colors"
                  >
                    0330 088 9669
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="bg-[#1e232b] py-20 md:py-28">
        <motion.div
          className="text-center px-6 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
          >
            Have Questions?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            If you have any concerns about your data or would like to know more,
            we&apos;re here to help.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
