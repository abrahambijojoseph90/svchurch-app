import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function MinistryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const ministry = await prisma.ministry.findUnique({
    where: { slug: params.slug },
  });

  if (!ministry) {
    notFound();
  }

  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-44 flex items-center justify-center bg-[#1e232b]">
        {(ministry.bannerImage || ministry.image) && (
          <Image
            src={ministry.bannerImage || ministry.image!}
            alt={ministry.name}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/70 to-[#1e232b]/90" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-cinzel)] text-[#ab815a] tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Ministry
          </p>

          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
            {ministry.name}
          </h1>

          {ministry.subtitle && (
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-6">
              {ministry.subtitle}
            </p>
          )}

          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      {/* ======================== DETAILS ======================== */}
      <section className="bg-[#faf8f5] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/about/ministries"
            className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All Ministries
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured image */}
              {ministry.image && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={ministry.image}
                    alt={ministry.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Mission statement */}
              {ministry.mission && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#ab815a]/10">
                  <h2 className="font-[family-name:var(--font-gilda)] text-2xl text-[#1e232b] mb-4">
                    Our Mission
                  </h2>
                  <p className="text-[#1e232b]/70 text-base leading-relaxed italic">
                    {ministry.mission}
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-[family-name:var(--font-gilda)] text-2xl text-[#1e232b] mb-4">
                  About This Ministry
                </h2>
                <p className="text-[#1e232b]/70 text-base sm:text-lg leading-relaxed">
                  {ministry.description}
                </p>
              </div>

              {/* Full content */}
              {ministry.fullContent && (
                <article className="prose prose-lg max-w-none text-[#1e232b]/75 leading-relaxed">
                  {ministry.fullContent.split("\n").map((paragraph, i) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={i} className="mb-5">
                        {trimmed}
                      </p>
                    );
                  })}
                </article>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule & Location card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-[family-name:var(--font-gilda)] text-xl text-[#1e232b] mb-5">
                  Details
                </h3>

                {ministry.schedule && (
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="w-5 h-5 text-[#ab815a] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#1e232b]/50 uppercase tracking-wider font-medium mb-1">
                        Schedule
                      </p>
                      <p className="text-[#1e232b]/80 text-sm">
                        {ministry.schedule}
                      </p>
                    </div>
                  </div>
                )}

                {ministry.location && (
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-[#ab815a] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#1e232b]/50 uppercase tracking-wider font-medium mb-1">
                        Location
                      </p>
                      <p className="text-[#1e232b]/80 text-sm">
                        {ministry.location}
                      </p>
                    </div>
                  </div>
                )}

                {!ministry.schedule && !ministry.location && (
                  <p className="text-[#1e232b]/50 text-sm">
                    Contact us for more details about this ministry.
                  </p>
                )}
              </div>

              {/* Contact CTA */}
              <div className="bg-[#1e232b] rounded-2xl p-6 text-center">
                <h3 className="font-[family-name:var(--font-gilda)] text-xl text-white mb-3">
                  Get Involved
                </h3>
                <p className="text-white/60 text-sm mb-5">
                  Interested in joining this ministry? We&apos;d love to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#ab815a] hover:bg-[#8a6744] text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
