"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";

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
/*  Contact info data                                                  */
/* ------------------------------------------------------------------ */

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "49 High Town Rd, Luton LU2 0BW",
    href: "https://www.google.com/maps/search/?api=1&query=49+High+Town+Rd+Luton+LU2+0BW",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0330 088 9669",
    href: "tel:03300889669",
  },
  {
    icon: Mail,
    label: "Email",
    value: "admin@svchurch.co.uk",
    href: "mailto:admin@svchurch.co.uk",
  },
  {
    icon: Clock,
    label: "Service Times",
    value: "Sunday: 8:15 AM \u2013 10:30 AM\nSunday School: 11:00 AM \u2013 12:00 PM\nFriday Bible Study: 8:00 PM \u2013 10:00 PM",
    href: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder for future API integration
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-40 flex items-center justify-center">
        <Image
          src="/images/backgrounds/church3-section-bg1.png"
          alt="Contact Spring Valley Church"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/80 via-[#1e232b]/70 to-[#1e232b]/90" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4"
          >
            Contact Us
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Get Connected With Us
          </motion.h1>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-16 h-[2px] bg-[#ab815a] mx-auto"
          />
        </motion.div>
      </section>

      {/* ======================== INTRO ======================== */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="text-[#1e232b]/70 text-lg sm:text-xl leading-relaxed"
          >
            We&apos;d love to connect with you! Reach out with questions, prayer
            requests, or if you&apos;d like to visit or volunteer. Our doors and
            hearts are always open.
          </motion.p>
        </div>
      </section>

      {/* ======================== CONTACT INFO + FORM ======================== */}
      <section className="bg-[#faf8f5] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 lg:gap-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {/* Left — Contact Info */}
            <div>
              <motion.div variants={fadeUp} custom={0} className="mb-8">
                <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                  Get In Touch
                </span>
                <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl text-[#1e232b] leading-snug mb-10"
              >
                We&apos;d Love to Hear From You
              </motion.h2>

              <div className="space-y-6">
                {contactDetails.map((detail, i) => {
                  const IconComponent = detail.icon;
                  return (
                    <motion.div
                      key={detail.label}
                      variants={fadeUp}
                      custom={i + 2}
                      className="flex items-start gap-5 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="w-12 h-12 bg-[#ab815a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[#ab815a]" />
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-cinzel)] text-[#1e232b] text-xs tracking-[0.15em] uppercase font-semibold mb-1">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            target={detail.label === "Address" ? "_blank" : undefined}
                            rel={detail.label === "Address" ? "noopener noreferrer" : undefined}
                            className="text-[#1e232b]/70 text-sm sm:text-base hover:text-[#ab815a] transition-colors"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="text-[#1e232b]/70 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right — Contact Form */}
            <motion.div variants={fadeUp} custom={2}>
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm">
                <h3 className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl text-[#1e232b] mb-2">
                  Send Us a Message
                </h3>
                <p className="text-[#1e232b]/50 text-sm mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Thank you for your message! We&apos;ll be in touch soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#1e232b]/80 text-sm font-medium mb-1.5"
                    >
                      Name <span className="text-[#f16923]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#1e232b]/10 rounded-lg text-[#1e232b] text-sm placeholder:text-[#1e232b]/30 focus:outline-none focus:ring-2 focus:ring-[#ab815a]/40 focus:border-[#ab815a] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#1e232b]/80 text-sm font-medium mb-1.5"
                    >
                      Email <span className="text-[#f16923]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#1e232b]/10 rounded-lg text-[#1e232b] text-sm placeholder:text-[#1e232b]/30 focus:outline-none focus:ring-2 focus:ring-[#ab815a]/40 focus:border-[#ab815a] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[#1e232b]/80 text-sm font-medium mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#1e232b]/10 rounded-lg text-[#1e232b] text-sm placeholder:text-[#1e232b]/30 focus:outline-none focus:ring-2 focus:ring-[#ab815a]/40 focus:border-[#ab815a] transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[#1e232b]/80 text-sm font-medium mb-1.5"
                    >
                      Message <span className="text-[#f16923]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-[#faf8f5] border border-[#1e232b]/10 rounded-lg text-[#1e232b] text-sm placeholder:text-[#1e232b]/30 focus:outline-none focus:ring-2 focus:ring-[#ab815a]/40 focus:border-[#ab815a] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 w-full justify-center sm:w-auto"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================== GOOGLE MAP ======================== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              Our Location
            </motion.span>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-12 h-[2px] bg-[#ab815a] mx-auto mt-3 mb-6"
            />
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-[#1e232b]"
            >
              You Can Find Us Here
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2448.5!2d-0.4138!3d51.8821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876367e15f7b4c1%3A0x1234567890abcdef!2s49%20High%20Town%20Rd%2C%20Luton%20LU2%200BW%2C%20UK!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
              width="100%"
              height="450"
              style={{ border: 0 }}
              className="w-full h-[300px] sm:h-[450px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Spring Valley Church location - 49 High Town Rd, Luton LU2 0BW"
            />
          </motion.div>

          <motion.div
            className="mt-6 flex items-center justify-center gap-2 text-[#1e232b]/60 text-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <MapPin className="w-4 h-4 text-[#ab815a]" />
            <span>49 High Town Rd, Luton LU2 0BW</span>
          </motion.div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="relative py-28 md:py-36">
        <Image
          src="/images/backgrounds/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1e232b]/85" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
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
            Join Us This Sunday
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Experience the warmth of our community. Whether you&apos;re new to
            faith or growing deeper, you&apos;re welcome here.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
