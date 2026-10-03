"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Clock, ArrowRight, SearchX, ArrowDownUp, ChevronDown, ImageOff } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/lib/posts/types";

type SortKey = "newest" | "quickest" | "trending";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "quickest", label: "Quickest Read" },
  { key: "trending", label: "Trending" },
];

function sortPosts(posts: BlogPost[], sort: SortKey) {
  const copy = [...posts];
  if (sort === "quickest") return copy.sort((a, b) => a.minutes - b.minutes);
  if (sort === "trending") return copy.sort((a, b) => Number(b.trending) - Number(a.trending));
  return copy;
}

export default function BlogExplorer({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("newest");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byQuery = posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
    return sortPosts(byQuery, sort);
  }, [posts, query, category, sort]);

  return (
    <section id="blog-grid" className="scroll-mt-24 border-t border-brand-border/60 py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Explore the Journal"
          title="Every Article, Filtered Your Way"
          description="Search by topic, browse by category, or sort for the quickest read — everything is here."
        />

        {/* Toolbar */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-[18px] border border-brand-border/70 bg-white p-3.5 shadow-[0_16px_40px_-20px_rgba(17,24,39,0.18)]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
                <Search className="size-4" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-brand-heading placeholder:text-brand-light focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-brand-light hover:text-brand-heading"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-[58px] w-full appearance-none rounded-[18px] border border-brand-border/70 bg-white py-3.5 pl-10 pr-9 text-[15px] font-medium text-brand-heading shadow-[0_16px_40px_-20px_rgba(17,24,39,0.18)] focus:outline-none sm:w-auto"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            </div>
          </div>

          {/* Category filter — horizontal scroll strip so it never wraps into a wall of pills */}
          <div className="-mx-6 mt-5 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  category === cat
                    ? "border-brand-primary bg-brand-primary text-white shadow-[0_8px_20px_-8px_rgba(63,163,77,0.55)]"
                    : "border-brand-border/70 bg-white text-brand-body hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-md"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 opacity-70">({counts.get(cat) ?? 0})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 text-center text-sm text-brand-light">
          Showing {filtered.length} of {posts.length} articles
        </div>

        {filtered.length > 0 ? (
          <motion.div layout className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-brand-border/60 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_28px_56px_-20px_rgba(17,24,39,0.25)]"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-brand-gray">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-light">
                          <ImageOff className="size-6" />
                        </div>
                      )}
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-primary-dark backdrop-blur">
                        {post.category}
                      </span>
                      {post.trending && (
                        <span className="absolute right-3.5 top-3.5 rounded-full bg-brand-orange-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          Trending
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg leading-snug text-brand-heading">{post.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-light">{post.excerpt}</p>

                      <div className="mt-5 flex items-center justify-between border-t border-brand-border/60 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="relative size-7 overflow-hidden rounded-full bg-brand-primary/12">
                            {post.author.avatar ? (
                              <Image src={post.author.avatar} alt={post.author.name} fill sizes="28px" className="object-cover" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-brand-primary-dark">
                                {post.author.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-brand-body">{post.author.name}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-brand-light">
                          <Clock className="size-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-dark">
                        Read Article
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-14 flex max-w-sm flex-col items-center gap-3 text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
              <SearchX className="size-6" />
            </span>
            <p className="font-display text-xl text-brand-heading">No articles found</p>
            <p className="text-sm text-brand-light">
              Try a different search term or clear the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-2 rounded-full border border-brand-primary/30 px-5 py-2.5 text-sm font-semibold text-brand-primary-dark transition-colors hover:bg-brand-primary/8"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
