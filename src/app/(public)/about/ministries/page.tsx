"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  HandHeart,
  GraduationCap,
  Heart,
  Shield,
  Globe,
  Clock,
  MapPin,
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

const cardFade = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, typeof Baby> = {
  Baby,
  HandHeart,
  GraduationCap,
  Heart,
  Shield,
  Globe,
};

/* ------------------------------------------------------------------ */
/*  Fallback data                                                      */
/* ------------------------------------------------------------------ */

const fallbackMinistries = [
  {
    icon: "Baby",
    name: "Kid\u2019s Club",
    slug: "kids-club",
    subtitle: "For children under 12",
    description:
      "Teaching the word of God with games and engaging activities that help children discover faith in a fun, nurturing environment.",
    schedule: "Every Second Saturday of the Month",
    location: null,
    image: "/images/ministries/church3-ministry-pic1.jpg",
  },
  {
    icon: "HandHeart",
    name: "Prayer Meetings",
    slug: "prayer-meetings",
    subtitle: "Prayer and Spiritual Encounters",
    description:
      "Monthly gatherings for prayer and worship \u2014 lifting up our families, community, and the nations in heartfelt intercession.",
    schedule: "Last Week of Every Month",
    location: null,
    image: "/images/ministries/church3-ministry-pic2.jpg",
  },
  {
    icon: "GraduationCap",
    name: "SVC Students and Twentees",
    slug: "svc-students-and-twentees",
    subtitle: "For ages 15\u201330",
    description:
      "Navigating faith, identity and purpose through discussions and fellowship \u2014 a dynamic space for young people to explore and grow.",
    schedule: "Every Second Tuesday",
    location: "Hightown Methodist Church",
    image: "/images/ministries/church3-ministry-pic3.jpg",
  },
  {
    icon: "Heart",
    name: "SVC Women\u2019s Fellowship",
    slug: "svc-womens-fellowship",
    subtitle: "In partnership with sisters",
    description:
      "Bible study, worship, encouragement, mentorship and outreach \u2014 empowering women to grow together in faith and community.",
    schedule: "Monthly (Date TBA)",
    location: null,
    image: "/images/ministries/church3-ministry-pic4.jpg",
  },
  {
    icon: "Shield",
    name: "SVC Men\u2019s Fellowship",
    slug: "svc-mens-fellowship",
    subtitle: "For the men of the church",
    description:
      "Discussions, fellowship, outdoor gatherings and community work \u2014 building each other up as men of God.",
    schedule: "Monthly (Date TBA)",
    location: null,
    image: "/images/ministries/church3-ministry-pic5.jpg",
  },
  {
    icon: "Globe",
    name: "SVC Missions",
    slug: "svc-missions",
    subtitle: "The heartbeat of the church is the Great Commission",
    description:
      "Mission work is central to who we are. From local outreach to global partnerships, we go where God leads to share His love.",
    schedule: null,
    location: null,
    image: "/images/ministries/church3-ministry-pic6.jpg",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState(fallbackMinistries);

  useEffect(() => {
    fetch("/api/ministries")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setMinistries(data);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-40 flex items-center justify-center">
        <Image
          src="/images/backgrounds/church3-section-bg1.png"
          alt="Ministries at Spring Valley Church"
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
            Our Ministries
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Serving Every Generation
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
            At Spring Valley Church, our ministries reflect our heart for every
            generation and stage of life. Whether you&apos;re a child taking
            your first steps in faith, a young adult seeking direction, or a
            seasoned believer looking to serve — there&apos;s a place for you.
          </motion.p>
        </div>
      </section>

      {/* ======================== MINISTRY CARDS ======================== */}
      <section className="bg-[#faf8f5] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-20 lg:gap-28">
            {ministries.map((ministry, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = iconMap[ministry.icon || "Heart"] || Heart;

              return (
                <motion.div
                  key={ministry.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={cardFade}
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                    !isEven ? "lg:direction-rtl" : ""
                  }`}
                >
                  {/* Image */}
                  <Link
                    href={`/about/ministries/${ministry.slug}`}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl block ${
                      !isEven ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={ministry.image || "/images/church3-home-pic1.jpg"}
                      alt={ministry.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e232b]/30 to-transparent" />
                  </Link>

                  {/* Content */}
                  <div className={!isEven ? "lg:order-1" : ""}>
                    <div className="w-14 h-14 bg-[#ab815a]/10 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent className="w-7 h-7 text-[#ab815a]" />
                    </div>

                    <h3 className="font-[family-name:var(--font-gilda)] text-2xl sm:text-3xl lg:text-4xl text-[#1e232b] mb-2">
                      {ministry.name}
                    </h3>

                    <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] text-xs tracking-[0.15em] uppercase font-semibold mb-4">
                      {ministry.subtitle}
                    </p>

                    <p className="text-[#1e232b]/65 text-base sm:text-lg leading-relaxed mb-6">
                      {ministry.description}
                    </p>

                    {ministry.schedule && (
                      <div className="flex items-center gap-3 text-[#1e232b]/70 text-sm mb-3">
                        <Clock className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                        <span>{ministry.schedule}</span>
                      </div>
                    )}

                    {ministry.location && (
                      <div className="flex items-center gap-3 text-[#1e232b]/70 text-sm">
                        <MapPin className="w-4 h-4 text-[#ab815a] flex-shrink-0" />
                        <span>{ministry.location}</span>
                      </div>
                    )}

                    <Link
                      href={`/about/ministries/${ministry.slug}`}
                      className="inline-flex items-center gap-2 mt-6 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors duration-300"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
            Ready to Get Involved?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Whatever your age or season of life, there&apos;s a ministry waiting
            for you. Reach out and take your next step.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-10 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide transition-colors duration-300"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
