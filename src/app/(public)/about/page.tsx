"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Eye, BookOpen, Users } from "lucide-react";

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

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const missionVisionCards = [
  {
    icon: Heart,
    label: "Our Mission",
    title: "Love God, Love People, Make Disciples",
    description:
      "We exist to glorify God by making disciples who love Jesus, serve the Church, and impact the world through the power of the Holy Spirit.",
  },
  {
    icon: Eye,
    label: "Our Vision",
    title: "A Church That Reflects Heaven on Earth",
    description:
      "To be a Spirit-filled, multicultural community where every generation encounters God, grows in faith, and is equipped to fulfil their calling.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
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
            About Us
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
            Our Story
          </motion.h1>
        </motion.div>
      </section>

      {/* ======================== WHO WE ARE ======================== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Image */}
            <motion.div
              variants={scaleIn}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/church3-about-pic1.jpg"
                alt="Spring Valley Church community worship"
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#ab815a]/30 rounded-2xl -z-10" />
            </motion.div>

            {/* Text */}
            <div>
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                  Who We Are
                </span>
                <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-[#1e232b] leading-snug mb-6"
              >
                Founded in Faith, Growing in Grace
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-4"
              >
                Founded in 2017 and affiliated with the{" "}
                <span className="text-[#ab815a] font-medium">
                  Assemblies of God UK
                </span>
                , Spring Valley Church is a vibrant and diverse community based
                in Luton, where we come together to worship and grow in Christ.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-6"
              >
                Our services are held in Malayalam, English, and Hindi,
                reflecting the rich multicultural tapestry of our congregation.
                We are united not by language or background, but by our shared
                love for Jesus and our desire to see His Kingdom come.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex flex-wrap gap-3"
              >
                {["Malayalam", "English", "Hindi"].map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-4 py-2 bg-[#faf8f5] border border-[#ab815a]/20 rounded-full text-sm text-[#1e232b]/80 font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================== MISSION & VISION ======================== */}
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
              className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold"
            >
              What Drives Us
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
              Mission &amp; Vision
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {missionVisionCards.map((card) => (
              <motion.div
                key={card.label}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="w-14 h-14 bg-[#ab815a]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#ab815a]/20 transition-colors duration-300">
                  <card.icon className="w-6 h-6 text-[#ab815a]" />
                </div>
                <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.15em] uppercase text-xs font-semibold">
                  {card.label}
                </span>
                <h3 className="font-[family-name:var(--font-gilda)] text-xl sm:text-2xl text-[#1e232b] mt-2 mb-4">
                  {card.title}
                </h3>
                <p className="text-[#1e232b]/60 text-sm sm:text-base leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== SERVANT LEADERSHIP BANNER ======================== */}
      <section className="relative py-20 md:py-28">
        <Image
          src="/images/church3-about-pic2.jpg"
          alt="Spring Valley Church leadership"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1e232b]/80" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
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
            Our Leadership
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
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Our pastoral team walks alongside the congregation with humility,
            dedication, and a heart for the Gospel.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Link
              href="/about/leadership"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-colors duration-300"
            >
              Meet Our Leaders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ======================== ROOTED IN THE WORD ======================== */}
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
                <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                  Our Foundation
                </span>
                <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-[#1e232b] leading-snug mb-6"
              >
                Rooted in the Word
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-4"
              >
                At the heart of everything we do is a deep commitment to the
                Word of God. We believe the Bible is the inspired, infallible,
                and authoritative Word of God — our ultimate guide for faith and
                life.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-6"
              >
                Through expository preaching, small group studies, and personal
                devotion, we encourage every believer to grow in the knowledge
                and grace of our Lord Jesus Christ.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-3 text-[#ab815a]"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium italic">
                  &ldquo;Your word is a lamp to my feet and a light to my
                  path.&rdquo; &mdash; Psalm 119:105
                </span>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              variants={slideInRight}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/church3-about-pic3.png"
                alt="Bible study and devotion"
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================== SHAPED BY COMMUNITY ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Image */}
            <motion.div
              variants={slideInLeft}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl md:order-1"
            >
              <Image
                src="/images/church3-about-pic2.jpg"
                alt="Church community fellowship"
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-3 -left-3 w-full h-full border-2 border-[#ab815a]/30 rounded-2xl -z-10" />
            </motion.div>

            {/* Text */}
            <div className="md:order-2">
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <span className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.2em] uppercase text-xs font-semibold">
                  Life Together
                </span>
                <div className="w-12 h-[2px] bg-[#ab815a] mt-3" />
              </motion.div>

              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl lg:text-5xl text-[#1e232b] leading-snug mb-6"
              >
                Shaped by Community
              </motion.h2>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-4"
              >
                We believe that faith is not meant to be lived in isolation.
                God created us for fellowship, and it is within the body of
                Christ that we find encouragement, accountability, and genuine
                love.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed mb-6"
              >
                From Sunday worship to midweek gatherings, from shared meals to
                prayer meetings, we are a family that walks together through
                every season of life. Whether you are celebrating or grieving,
                you will never walk alone.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-3 text-[#ab815a]"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium italic">
                  &ldquo;And let us consider how to stir up one another to love
                  and good works.&rdquo; &mdash; Hebrews 10:24
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================== CTA BANNER ======================== */}
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
            Come As You Are
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Whether you&apos;re exploring faith for the first time or looking
            for a church to call home, we would love to welcome you.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Plan Your Visit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
