"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, BookOpen, Clock, ArrowRight, ChefHat } from "lucide-react";
import Container from "@/components/ui/Container";
import type { Recipe } from "@/lib/recipes/types";
import type { BlogPost } from "@/lib/posts/types";

const PREVIEW_COUNT = 8;

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link
        href={`/recipes/${recipe.slug}`}
        className="group flex flex-col overflow-hidden rounded-[20px] border border-brand-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(63,163,77,0.25)]"
      >
        <div className="relative h-48 overflow-hidden bg-brand-gray">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.imageAlt || recipe.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-primary/5">
              <ChefHat className="size-10 text-brand-primary/30" />
            </div>
          )}
          {recipe.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-primary-dark shadow-sm backdrop-blur">
              {recipe.tag}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-brand-heading transition-colors group-hover:text-brand-primary-dark">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-brand-light">
              {recipe.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            {recipe.totalTimeMinutes ? (
              <span className="flex items-center gap-1 text-[11px] text-brand-light">
                <Clock className="size-3.5" />{recipe.totalTimeMinutes} min
              </span>
            ) : <span />}
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-primary-dark transition-all group-hover:gap-2">
              View recipe <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-[20px] border border-brand-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(245,158,11,0.2)]"
      >
        <div className="relative h-48 overflow-hidden bg-brand-gray">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-orange/10 to-brand-orange/5">
              <BookOpen className="size-10 text-brand-orange/30" />
            </div>
          )}
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-orange shadow-sm backdrop-blur">
              {post.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-brand-heading transition-colors group-hover:text-brand-orange">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-brand-light">
              {post.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="flex items-center gap-1 text-[11px] text-brand-light">
              <Clock className="size-3.5" />{post.readTime}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-orange transition-all group-hover:gap-2">
              Read article <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface Props {
  recipes: Recipe[];
  posts: BlogPost[];
  authorName: string;
}

export default function AuthorContent({ recipes, posts, authorName }: Props) {
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const visibleRecipes = showAllRecipes ? recipes : recipes.slice(0, PREVIEW_COUNT);
  const visiblePosts = showAllPosts ? posts : posts.slice(0, PREVIEW_COUNT);

  if (recipes.length === 0 && posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <Container>
        {/* Recipes section */}
        {recipes.length > 0 && (
          <div className={posts.length > 0 ? "mb-20" : ""}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-end justify-between"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary/10">
                    <UtensilsCrossed className="size-4 text-brand-primary-dark" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-primary-dark">Recipes</span>
                </div>
                <h2 className="font-display text-[28px] leading-tight text-brand-heading sm:text-[34px]">
                  By {authorName}
                </h2>
              </div>
              {recipes.length > PREVIEW_COUNT && !showAllRecipes && (
                <button
                  onClick={() => setShowAllRecipes(true)}
                  className="hidden items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/8 px-4 py-2 text-sm font-semibold text-brand-primary-dark transition-all hover:bg-brand-primary/15 sm:flex"
                >
                  View all {recipes.length} <ArrowRight className="size-3.5" />
                </button>
              )}
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {visibleRecipes.map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {recipes.length > PREVIEW_COUNT && !showAllRecipes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={() => setShowAllRecipes(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-primary-dark hover:shadow-lg"
                >
                  View all {recipes.length} recipes <ArrowRight className="size-4" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Blog posts section */}
        {posts.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-end justify-between"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-orange/10">
                    <BookOpen className="size-4 text-brand-orange" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">Articles</span>
                </div>
                <h2 className="font-display text-[28px] leading-tight text-brand-heading sm:text-[34px]">
                  Articles by {authorName}
                </h2>
              </div>
              {posts.length > PREVIEW_COUNT && !showAllPosts && (
                <button
                  onClick={() => setShowAllPosts(true)}
                  className="hidden items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/8 px-4 py-2 text-sm font-semibold text-brand-orange transition-all hover:bg-brand-orange/15 sm:flex"
                >
                  View all {posts.length} <ArrowRight className="size-3.5" />
                </button>
              )}
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {visiblePosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {posts.length > PREVIEW_COUNT && !showAllPosts && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <button
                  onClick={() => setShowAllPosts(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#e08e00] hover:shadow-lg"
                >
                  View all {posts.length} articles <ArrowRight className="size-4" />
                </button>
              </motion.div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
