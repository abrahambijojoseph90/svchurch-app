"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Church, BookOpen, Users, ArrowRight, Play } from "lucide-react";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
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

const ministries = [
  {
    title: "Kid's Club",
    description:
      "Fun, faith-filled activities that help children discover God's love and build lasting friendships.",
  },
  {
    title: "Prayer Meetings",
    description:
      "Dedicated times of intercession and praise — lifting up our families, community, and the nations.",
  },
  {
    title: "Students & Twentees",
    description:
      "A dynamic space for young people to explore faith, ask questions, and grow together.",
  },
];

const leaders = [
  {
    name: "Thomas Samuel & Praisy Samuel",
    role: "Pastor & Wife",
    image: "/images/leadership/church3-priests-pic1.jpg",
  },
  {
    name: "Simon Varghese",
    role: "Treasurer",
    image: "/images/leadership/church3-priests-pic2.jpg",
  },
  {
    name: "Bijo Abraham",
    role: "Trustee",
    image: "/images/leadership/church3-priests-pic3.jpg",
  },
];

const galleryImages = Array.from(
  { length: 6 },
  (_, i) => `/images/gallery/church3-gallery-pic${i + 1}.jpg`
);

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <Image
          src="/images/backgrounds/hero-bg.jpg"
          alt="Spring Valley Church worship"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/70 via-[#1e232b]/60 to-[#1e232b]/80" />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-6"
          >
            Spring Valley Church
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            The Valley of New Birth,
            <br />
            New Life, Growth
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Welcome to Spring Valley Church — A vibrant, multicultural community
            in Luton worshipping in Malayalam, English &amp; Hindi.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-8 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Join Us This Sunday
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/media-centre/media"
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              <Play className="w-4 h-4" />
              Watch Online
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ======================== WELCOME ======================== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Text */}
            <div>
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <span className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                  Welcome
                </span>
                <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-[#1e232b] leading-snug mb-6"
              >
                A Warm, Inclusive Space to Connect, Worship &amp; Serve
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-4"
              >
                Spring Valley Church is a Christ-centered community celebrating
                faith, family, and unity across cultures. Rooted in God&apos;s
                Word and empowered by the Holy Spirit, we gather to worship, grow,
                and reach out with the love of Jesus.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-8"
              >
                Whether you speak Malayalam, English, or Hindi, you&apos;ll find a
                home here. We believe every person is created with purpose and
                valued beyond measure. Come as you are — and discover the life God
                has for you.
              </motion.p>

              <motion.div variants={fadeUp} custom={4}>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#ab815a] font-medium hover:text-[#8a6744] transition-colors"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              variants={scaleIn}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/church3-about-pic1.jpg"
                alt="Spring Valley Church community"
                fill
                className="object-cover"
              />
              {/* Decorative border accent */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#ab815a]/30 rounded-2xl -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================== SERVICE TIMES ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              Join Us
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
              Service Times
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-[#ab815a]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ab815a]/20 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-[#ab815a]" />
                </div>
                <h3 className="font-[family-name:var(--font-gilda)] text-xl sm:text-2xl text-[#1e232b] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#ab815a] font-semibold text-sm tracking-wide mb-4">
                  {service.time}
                </p>
                <p className="text-[#1e232b]/60 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== MINISTRIES ======================== */}
      <section className="bg-[#1e232b] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              Get Involved
            </motion.span>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="w-12 h-[2px] bg-[#ab815a] mx-auto mt-3 mb-6"
            />
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-white"
            >
              Our Ministries
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {ministries.map((ministry) => (
              <motion.div
                key={ministry.title}
                variants={fadeUp}
                className="border border-white/10 hover:border-[#ab815a]/60 rounded-2xl p-8 lg:p-10 transition-all duration-300 group"
              >
                <h3 className="font-[family-name:var(--font-gilda)] text-xl sm:text-2xl text-white mb-4 group-hover:text-[#ab815a] transition-colors duration-300">
                  {ministry.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {ministry.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link
              href="/about/ministries"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-colors duration-300"
            >
              Explore All Ministries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================== LEADERSHIP ======================== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              Leadership
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
              Led by Servants Who Love the Church
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {leaders.map((leader) => (
              <motion.div
                key={leader.name}
                variants={fadeUp}
                className="text-center group"
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Ring accent */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-[#ab815a]/20 group-hover:ring-[#ab815a]/50 transition-all duration-300" />
                </div>
                <h3 className="font-[family-name:var(--font-gilda)] text-xl sm:text-2xl text-[#1e232b] mb-1">
                  {leader.name}
                </h3>
                <p className="text-[#ab815a] text-sm font-medium tracking-wide">
                  {leader.role}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link
              href="/about/leadership"
              className="inline-flex items-center gap-2 text-[#ab815a] font-medium hover:text-[#8a6744] transition-colors"
            >
              Meet Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================== GALLERY ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              Gallery
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
              Our Life Together
            </motion.h2>
          </motion.div>

          <motion.div
            className="columns-2 md:columns-3 gap-4 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {galleryImages.map((src, i) => (
              <motion.div
                key={src}
                variants={scaleIn}
                className="break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
              >
                <div
                  className={`relative ${
                    i % 3 === 0
                      ? "aspect-[3/4]"
                      : i % 3 === 1
                      ? "aspect-square"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Spring Valley Church gallery ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#1e232b]/0 group-hover:bg-[#1e232b]/20 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Link
              href="/media-centre/gallery"
              className="inline-flex items-center gap-2 text-[#ab815a] font-medium hover:text-[#8a6744] transition-colors"
            >
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ======================== CTA BANNER ======================== */}
      <section className="relative py-28 md:py-36">
        {/* Background */}
        <Image
          src="/images/backgrounds/church3-section-bg1.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1e232b]/80" />

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
            Join Our Community
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Whether you&apos;re new to faith or growing deeper, there&apos;s a
            place for you.
          </motion.p>

          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Get Connected
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
