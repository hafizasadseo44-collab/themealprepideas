"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/posts/types";

export default function GuidesGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {posts.map((post, i) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-18px_rgba(17,24,39,0.22)]"
          >
            <div className="relative h-52 w-full overflow-hidden bg-brand-gray">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
            </div>
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark">{post.readTime}</span>
              <h3 className="mt-2 font-display text-xl leading-snug text-brand-heading">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-light">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                Read Guide
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
