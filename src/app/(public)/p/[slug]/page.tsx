import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function CustomPageView({
  params,
}: {
  params: { slug: string };
}) {
  const page = await prisma.customPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page || !page.published) {
    notFound();
  }

  return (
    <main className="overflow-x-hidden">
      {/* ======================== HERO ======================== */}
      <section className="relative py-32 md:py-40 flex items-center justify-center bg-[#1e232b]">
        {page.heroImage && (
          <Image
            src={page.heroImage}
            alt={page.title}
            fill
            className="object-cover opacity-25"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e232b]/80 to-[#1e232b]/90" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="font-[family-name:var(--font-gilda)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
            {page.title}
          </h1>

          {page.excerpt && (
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6">
              {page.excerpt}
            </p>
          )}

          <div className="w-16 h-[2px] bg-[#ab815a] mx-auto" />
        </div>
      </section>

      {/* ======================== CONTENT ======================== */}
      <section className="bg-[#faf8f5] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#ab815a] font-medium text-sm hover:text-[#f16923] transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Render HTML content from rich text editor */}
          <article
            className="prose prose-lg max-w-none text-[#1e232b]/80 leading-relaxed
              prose-headings:font-[family-name:var(--font-gilda)] prose-headings:text-[#1e232b]
              prose-a:text-[#ab815a] prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-l-[#ab815a] prose-blockquote:text-[#1e232b]/60
              prose-strong:text-[#1e232b]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </main>
  );
}
