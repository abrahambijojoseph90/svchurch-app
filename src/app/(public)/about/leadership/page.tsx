"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

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

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const leaders = [
  {
    name: "Thomas Samuel & Praisy Samuel",
    role: "Pastor & Wife",
    image: "/images/leadership/church3-priests-pic1.jpg",
    bio: "Pastor Thomas Samuel and his wife Praisy have faithfully led Spring Valley Church since its founding in 2017. With a heart for multicultural ministry and a deep passion for God\u2019s Word, they shepherd the congregation with love, wisdom, and unwavering commitment to the Gospel. Together, they model servant leadership and a Christ-centered home, inspiring families across the church.",
    hasSocials: false,
  },
  {
    name: "Simon Varghese",
    role: "Treasurer",
    image: "/images/leadership/church3-priests-pic2.jpg",
    bio: "Simon Varghese serves as the Treasurer of Spring Valley Church, ensuring faithful stewardship of the church\u2019s resources. With a spirit of integrity and diligence, he manages the financial affairs of the church, enabling the ministry to grow and serve the community effectively. His dedication reflects a deep commitment to accountability and God-honouring service.",
    hasSocials: false,
  },
  {
    name: "Bijo Abraham",
    role: "Trustee",
    image: "/images/leadership/church3-priests-pic3.jpg",
    bio: "Bijo Abraham serves as a Trustee of Spring Valley Church, providing governance and strategic oversight to support the church\u2019s mission. With a heart for the local church and a commitment to its growth, he works behind the scenes to ensure the ministry operates with excellence, transparency, and faithfulness to its calling.",
    hasSocials: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Social Icon Components                                             */
/* ------------------------------------------------------------------ */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function LeadershipPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ======================== HERO BANNER ======================== */}
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
            Leadership
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
            Our Pastoral Team &amp; Staff
          </motion.h1>
        </motion.div>
      </section>

      {/* ======================== INTRO ======================== */}
      <section className="bg-white py-16 md:py-20">
        <motion.div
          className="max-w-3xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed"
          >
            We believe God calls qualified, Spirit-led men to serve the church
            through servant leadership, committed to walking alongside the
            church in faith and love.
          </motion.p>
        </motion.div>
      </section>

      {/* ======================== LEADER CARDS ======================== */}
      <section className="bg-[#faf8f5] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20 md:space-y-28">
          {leaders.map((leader, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={leader.name}
                className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
              >
                {/* Image */}
                <motion.div
                  variants={isEven ? slideInLeft : slideInRight}
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group ${
                    !isEven ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e232b]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Decorative accent */}
                  <div
                    className={`absolute -bottom-3 ${
                      isEven ? "-right-3" : "-left-3"
                    } w-full h-full border-2 border-[#ab815a]/20 rounded-2xl -z-10`}
                  />
                </motion.div>

                {/* Content */}
                <motion.div
                  variants={isEven ? slideInRight : slideInLeft}
                  className={!isEven ? "md:order-1" : ""}
                >
                  <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                    {leader.role}
                  </span>
                  <div className="w-10 h-[2px] bg-[#ab815a] mt-3 mb-4" />

                  <h2 className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl lg:text-4xl text-[#1e232b] leading-snug mb-6">
                    {leader.name}
                  </h2>

                  <p className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-8">
                    {leader.bio}
                  </p>

                  {/* Actions */}
                  {leader.hasSocials ? (
                    <div className="flex items-center gap-4">
                      <a
                        href="#"
                        aria-label={`${leader.name} on Facebook`}
                        className="w-10 h-10 bg-[#1e232b]/5 hover:bg-[#ab815a] rounded-full flex items-center justify-center text-[#1e232b]/50 hover:text-white transition-all duration-300"
                      >
                        <FacebookIcon className="w-4 h-4" />
                      </a>
                      <a
                        href="#"
                        aria-label={`${leader.name} on Instagram`}
                        className="w-10 h-10 bg-[#1e232b]/5 hover:bg-[#ab815a] rounded-full flex items-center justify-center text-[#1e232b]/50 hover:text-white transition-all duration-300"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                      <a
                        href="#"
                        aria-label={`${leader.name} on YouTube`}
                        className="w-10 h-10 bg-[#1e232b]/5 hover:bg-[#ab815a] rounded-full flex items-center justify-center text-[#1e232b]/50 hover:text-white transition-all duration-300"
                      >
                        <YouTubeIcon className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-colors duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Us
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ======================== BOTTOM BANNER ======================== */}
      <section className="bg-[#1e232b] py-20 md:py-28">
        <motion.div
          className="text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.3em] uppercase text-xs font-medium mb-4 block"
          >
            Servant Leadership
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-white leading-snug mb-6"
          >
            We Are Led By Servants Who Love the Church
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Our leaders serve with humility, integrity, and a deep love for
            God&apos;s people. Together, we seek to honour Christ in all that we
            do.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
