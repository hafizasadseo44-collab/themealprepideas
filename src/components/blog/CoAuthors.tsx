"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ChefHat, ArrowRight } from "lucide-react";
import type { CoAuthor } from "@/lib/posts/queries";

export default function CoAuthors({ authors }: { authors: CoAuthor[] }) {
  if (!authors || authors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 overflow-hidden rounded-[20px] border border-brand-orange/20 bg-gradient-to-br from-[#fff9f0] via-white to-white shadow-sm"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-orange/6 blur-2xl" />

      <div className="relative p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-brand-orange/10">
            <Users className="size-3.5 text-brand-orange" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
            Co-Authors
          </span>
        </div>

        <div className="space-y-3">
          {authors.map((author, i) => {
            const initials = (author.full_name ?? "?").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/authors/${author.id}`}
                  className="group flex items-center gap-3 rounded-[14px] border border-brand-border/50 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-md"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    {author.avatar_url ? (
                      <Image
                        src={author.avatar_url}
                        alt={author.full_name ?? "Co-author"}
                        fill
                        sizes="40px"
                        className="object-cover ring-2 ring-brand-orange/20"
                      />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange/60 to-brand-orange text-white text-sm font-bold">
                        {initials || <ChefHat className="size-4" />}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-brand-heading transition-colors group-hover:text-brand-orange">
                      {author.full_name ?? "Unknown Author"}
                    </p>
                    {author.job_title && (
                      <p className="truncate text-[11px] text-brand-light">{author.job_title}</p>
                    )}
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-brand-light transition-all group-hover:translate-x-1 group-hover:text-brand-orange" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
