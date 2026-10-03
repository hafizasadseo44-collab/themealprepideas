"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import type { BlogPost } from "@/lib/posts/types";

export default function ArticleHeader({ post }: { post: BlogPost }) {
  return (
    <section className="pb-10 pt-8 md:pb-14 md:pt-12">
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-primary-dark"
          >
            <ArrowLeft className="size-4" />
            Back to the Journal
          </Link>

          <span className="mt-6 inline-flex items-center rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-primary-dark">
            {post.category}
          </span>

          <h1 className="mt-4 max-w-3xl text-balance font-display text-[30px] leading-[1.15] text-brand-heading sm:text-[38px] md:text-[46px]">
            {post.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-body sm:text-lg">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-brand-primary/12">
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.name} fill sizes="40px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-primary-dark">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-brand-heading">{post.author.name}</p>
                <p className="text-xs text-brand-light">Author</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-brand-light">
              <Calendar className="size-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-brand-light">
              <Clock className="size-4" />
              {post.readTime}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mt-10 h-[220px] w-full overflow-hidden rounded-[24px] sm:h-[320px] md:h-[420px]"
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
          />
        </motion.div>
      </Container>
    </section>
  );
}
