"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

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
  visible: { transition: { staggerChildren: 0.08 } },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const galleryImages = Array.from(
  { length: 18 },
  (_, i) => `/images/gallery/church3-gallery-pic${i + 1}.jpg`
);

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function GalleryPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
            Gallery
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-[family-name:var(--font-gilda)] text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6"
          >
            Our Life Together
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-16 h-[2px] bg-[#ab815a] mx-auto"
          />
        </motion.div>
      </section>

      {/* ======================== MASONRY GRID ======================== */}
      <section className="bg-[#faf8f5] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
          >
            {galleryImages.map((src, i) => (
              <motion.div
                key={src}
                variants={imageReveal}
                className="break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setLightboxImage(src)}
              >
                <div
                  className={`relative ${
                    i % 4 === 0
                      ? "aspect-[3/4]"
                      : i % 4 === 1
                      ? "aspect-square"
                      : i % 4 === 2
                      ? "aspect-[4/3]"
                      : "aspect-[3/2]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Spring Valley Church gallery ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#1e232b]/0 group-hover:bg-[#1e232b]/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wide">
                      View
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================== LIGHTBOX ======================== */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#1e232b]/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl w-full aspect-[4/3] rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Gallery photo enlarged"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
