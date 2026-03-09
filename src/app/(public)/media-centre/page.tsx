"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Video, Camera, Clock, ArrowRight, Church, BookOpen, Users } from "lucide-react";

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
  },
  {
    icon: BookOpen,
    title: "Sunday School",
    time: "11:00 AM - 12:00 PM",
  },
  {
    icon: Users,
    title: "Friday Bible Study",
    time: "08:00 PM - 10:00 PM",
  },
];

const mediaSections = [
  {
    title: "Media",
    description: "Sermons, teachings and worship",
    icon: Video,
    href: "/media-centre/media",
    accent: "#f16923",
  },
  {
    title: "Gallery",
    description: "Photos from our life together",
    icon: Camera,
    href: "/media-centre/gallery",
    accent: "#ab815a",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MediaCentrePage() {
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
            Media Centre
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Watch, Listen &amp; Explore
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-16 h-[2px] bg-[#ab815a] mx-auto"
          />
        </motion.div>
      </section>

      {/* ======================== MEDIA CARDS ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {mediaSections.map((section) => (
              <motion.div key={section.title} variants={fadeUp}>
                <Link href={section.href} className="block group">
                  <div className="bg-white rounded-2xl p-10 lg:p-14 shadow-sm hover:shadow-xl transition-all duration-300 text-center group-hover:-translate-y-2">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors duration-300"
                      style={{ backgroundColor: `${section.accent}15` }}
                    >
                      <section.icon
                        className="w-9 h-9 transition-colors duration-300"
                        style={{ color: section.accent }}
                      />
                    </div>

                    <h2 className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl text-[#1e232b] mb-3 group-hover:text-[#ab815a] transition-colors duration-300">
                      {section.title}
                    </h2>

                    <p className="text-[#1e232b]/60 text-base leading-relaxed mb-6">
                      {section.description}
                    </p>

                    <span className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm">
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== SERVICE TIMES ======================== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-14 h-14 bg-[#ab815a]/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Clock className="w-6 h-6 text-[#ab815a]" />
            </motion.div>
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              When We Meet
            </motion.span>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-12 h-[2px] bg-[#ab815a] mx-auto mt-3 mb-6"
            />
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl text-[#1e232b]"
            >
              Service Times
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                className="bg-[#faf8f5] rounded-2xl p-8 text-center"
              >
                <div className="w-12 h-12 bg-[#ab815a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-5 h-5 text-[#ab815a]" />
                </div>
                <h3 className="font-[family-name:var(--font-gilda)] text-lg text-[#1e232b] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#ab815a] font-semibold text-sm tracking-wide">
                  {service.time}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
