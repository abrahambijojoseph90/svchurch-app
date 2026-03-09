"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Church, BookOpen, Users, ArrowRight } from "lucide-react";

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
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const services = [
  {
    icon: Church,
    title: "Sunday Service",
    time: "08:15 AM - 10:30 AM",
    description: "Join us for a powerful time of worship, prayer, and the Word.",
  },
  {
    icon: BookOpen,
    title: "Sunday School",
    time: "11:00 AM - 12:00 PM",
    description:
      "Deepening faith through study and fellowship for all age groups.",
  },
  {
    icon: Users,
    title: "Friday Bible Study",
    time: "08:00 PM - 10:00 PM",
    description:
      "Midweek gathering for prayer, teaching, and spiritual growth.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MediaPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-40 flex items-center justify-center bg-[#1e232b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/90 to-[#1e232b]/70" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-6"
          >
            Media
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Sermons &amp; Teachings
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-16 h-[2px] bg-[#ab815a] mx-auto"
          />
        </motion.div>
      </section>

      {/* ======================== CONTENT ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content area */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeUp}
                className="bg-white rounded-2xl p-10 md:p-16 text-center shadow-sm"
              >
                <div className="w-24 h-24 bg-[#ab815a]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Video className="w-10 h-10 text-[#ab815a]" />
                </div>

                <h2 className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl text-[#1e232b] mb-4">
                  Coming Soon
                </h2>

                <p className="text-[#1e232b]/60 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                  Sermon recordings and teachings will be available here.
                  We&apos;re preparing a library of messages to encourage your
                  faith journey throughout the week.
                </p>

                <div className="w-16 h-[2px] bg-[#ab815a]/30 mx-auto mb-8" />

                <p className="text-[#1e232b]/40 text-sm">
                  In the meantime, join us in person for worship and the Word.
                </p>

                <motion.div variants={fadeUp} className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-colors duration-300"
                  >
                    Visit Us This Sunday
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Sidebar — Service Times */}
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <div className="mb-8">
                  <span className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                    When We Meet
                  </span>
                  <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
                </div>

                <h3 className="font-[family-name:var(--font-gilda)] text-2xl text-[#1e232b] mb-8">
                  Service Times
                </h3>
              </motion.div>

              <div className="space-y-4">
                {services.map((service) => (
                  <motion.div
                    key={service.title}
                    variants={fadeUp}
                    className="bg-white rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#ab815a]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <service.icon className="w-4 h-4 text-[#ab815a]" />
                      </div>
                      <div>
                        <h4 className="font-[family-name:var(--font-gilda)] text-lg text-[#1e232b] mb-1">
                          {service.title}
                        </h4>
                        <p className="text-[#ab815a] font-semibold text-sm tracking-wide mb-2">
                          {service.time}
                        </p>
                        <p className="text-[#1e232b]/50 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Gallery link */}
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  href="/media-centre/gallery"
                  className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors duration-300"
                >
                  Browse our photo gallery
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
}
