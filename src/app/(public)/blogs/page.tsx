"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

const cardVariant = {
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

const blogPosts = [
  {
    title: "To the Stranger and the Friend",
    date: "July 1, 2025",
    author: "Rebecca Mathew",
    image: "/images/church3-home-pic1.jpg",
    excerpt:
      "A reflection on hospitality, belonging, and the transformative power of welcoming others into our lives and into the family of God.",
    slug: "to-the-stranger-and-the-friend",
  },
  {
    title: "Mary Magdalene After the Resurrection",
    date: "June 15, 2025",
    author: "Spring Valley Church",
    image: "/images/church3-home-pic4.jpg",
    excerpt:
      "Exploring the profound encounter at the empty tomb and what Mary Magdalene\u2019s faith journey teaches us about devotion and hope.",
    slug: "mary-magdalene-after-the-resurrection",
  },
  {
    title: "Factors That Help Us to Know God",
    date: "June 1, 2025",
    author: "Spring Valley Church",
    image: "/images/church3-home-pic5.jpg",
    excerpt:
      "What draws us closer to the Creator? We explore the practices, postures, and relationships that open our hearts to knowing God more deeply.",
    slug: "factors-that-help-us-to-know-god",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function BlogsPage() {
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
            Blogs
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Stories of Faith &amp; Growth
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-16 h-[2px] bg-[#ab815a] mx-auto"
          />
        </motion.div>
      </section>

      {/* ======================== BLOG GRID ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.slug}
                variants={cardVariant}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Date badge */}
                  <div className="absolute top-4 left-4 bg-[#1e232b]/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {post.date}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] text-xs tracking-[0.15em] uppercase mb-3">
                    {post.author}
                  </p>

                  <h2 className="font-[family-name:var(--font-gilda)] text-xl sm:text-2xl text-[#1e232b] leading-snug mb-3 group-hover:text-[#ab815a] transition-colors duration-300">
                    {post.title}
                  </h2>

                  <p className="text-[#1e232b]/60 text-sm leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors duration-300"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
