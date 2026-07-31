"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, PlayCircle, Star, Users, Salad } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { heroPills } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-primary/12 via-brand-orange/8 to-transparent blur-3xl" />
        <div className="absolute right-[-120px] top-[280px] h-[320px] w-[320px] rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary-dark shadow-sm backdrop-blur">
              <Salad className="size-4" />
              75+ Recipes &middot; Updated for 2026
            </div>

            <h1 className="mt-6 font-display text-[42px] leading-[1.08] text-balance text-brand-heading sm:text-[52px] lg:text-[58px]">
              75+ Easy Meal Prep Ideas for Every Goal &amp; Schedule
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
              A premium collection of simple, healthy meal prep recipes — from
              high-protein bowls to freezer-friendly dinners. Plan less, eat
              better, and save hours every week with recipes built for real
              life.
            </p>

            {/* Search bar */}
            <form className="mt-8 flex max-w-lg items-center gap-2 rounded-[18px] border border-brand-border/70 bg-white p-2 shadow-[0_16px_40px_-16px_rgba(17,24,39,0.18)]">
              <Search className="ml-2 size-5 shrink-0 text-brand-light" />
              <input
                type="search"
                placeholder="Search &ldquo;high protein lunch&rdquo;, &ldquo;chicken&rdquo;..."
                className="h-11 w-full bg-transparent text-[15px] text-brand-heading placeholder:text-brand-light focus:outline-none"
                aria-label="Search recipes"
              />
              <Button size="md" className="shrink-0">
                Search
              </Button>
            </form>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href="/recipes" size="lg" icon={ArrowRight}>
                Browse All Recipes
              </Button>
              <Button href="/guides/how-to-meal-prep" variant="ghost" size="lg" icon={PlayCircle} iconPosition="left">
                How Meal Prep Works
              </Button>
            </div>

            {/* Category pills */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {heroPills.map((pill) => (
                <Link
                  key={pill}
                  href={`/categories/${pill.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-full border border-brand-border/70 bg-white/80 px-4 py-2 text-sm font-medium text-brand-body transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary-dark hover:shadow-md"
                >
                  {pill}
                </Link>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-brand-border/60 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {["photo-1517673132405-a56a62b18caf", "photo-1502685104226-ee32379fefbe", "photo-1544005313-94ddf0286df2"].map((id) => (
                    <div key={id} className="size-9 overflow-hidden rounded-full border-2 border-white">
                      <Image src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=80`} alt="" width={36} height={36} className="size-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-brand-heading flex items-center gap-1">
                    <Users className="size-3.5 text-brand-primary" /> 120,000+
                  </p>
                  <p className="text-brand-light">home cooks weekly</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-brand-orange">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-brand-heading">4.9/5</span>
                <span className="text-brand-light">from 2,400+ reviews</span>
              </div>
            </div>
          </motion.div>

          {/* Right: editorial image composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative mx-auto h-[460px] w-full max-w-[560px] sm:h-[540px] lg:h-[600px]"
          >
            <div className="absolute right-[6%] top-0 h-[62%] w-[58%] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-20px_rgba(17,24,39,0.35)]">
              <Image
                src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=900&q=80"
                alt="Chicken and rice meal prep containers with fresh vegetables"
                fill
                sizes="(min-width: 1024px) 360px, 60vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>

            <div className="absolute bottom-[4%] left-0 h-[46%] w-[54%] overflow-hidden rounded-[24px] shadow-[0_24px_48px_-16px_rgba(17,24,39,0.3)]">
              <Image
                src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80"
                alt="Overnight oats with fresh berries in a glass jar"
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute bottom-[18%] right-0 h-[30%] w-[34%] overflow-hidden rounded-[20px] border-4 border-white shadow-[0_20px_40px_-14px_rgba(17,24,39,0.3)]">
              <Image
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
                alt="Fresh salad bowl with vegetables"
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>

            {/* Floating ingredient accents */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[8%] top-[8%] flex items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary-dark">
                <Star className="size-4 fill-current" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-brand-heading">4.9 Rating</p>
                <p className="text-[11px] text-brand-light">2,400+ reviews</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-3 bottom-[2%] flex items-center gap-2 rounded-2xl border border-brand-border/60 bg-white/90 px-3.5 py-2.5 shadow-[0_16px_32px_-12px_rgba(17,24,39,0.25)] backdrop-blur sm:right-4"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange-deep">
                🔥
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-brand-heading">480 kcal</p>
                <p className="text-[11px] text-brand-light">38g protein</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
