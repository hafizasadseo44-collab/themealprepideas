"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame, ImageOff } from "lucide-react";
import Container from "@/components/ui/Container";
import type { BlogPost } from "@/lib/posts/types";

export default function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <section className="pb-8 md:pb-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 overflow-hidden rounded-[28px] border border-brand-border/60 bg-white shadow-[0_24px_60px_-24px_rgba(17,24,39,0.25)] transition-all duration-300 hover:shadow-[0_32px_72px_-24px_rgba(17,24,39,0.32)] lg:grid-cols-2"
          >
            <div className="relative h-64 w-full overflow-hidden bg-brand-gray lg:h-full">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand-light">
                  <ImageOff className="size-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 lg:hidden" />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-orange-deep px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                <Flame className="size-3.5" />
                Featured
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="inline-flex w-fit items-center rounded-full bg-brand-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-primary-dark">
                {post.category}
              </span>

              <h2 className="mt-5 text-balance font-display text-[28px] leading-[1.15] text-brand-heading md:text-[36px]">
                {post.title}
              </h2>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-light md:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-9 overflow-hidden rounded-full border-2 border-white bg-brand-primary/12 shadow-sm">
                    {post.author.avatar ? (
                      <Image src={post.author.avatar} alt={post.author.name} fill sizes="36px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-primary-dark">
                        {post.author.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-brand-heading">{post.author.name}</p>
                    <p className="text-xs text-brand-light">{post.date}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-brand-light">
                  <Clock className="size-4" />
                  {post.readTime}
                </span>
              </div>

              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-[14px] bg-brand-heading px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 group-hover:gap-3 group-hover:bg-black">
                Read Full Article
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
