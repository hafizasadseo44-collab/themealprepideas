"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Bookmark, CheckCircle2, ChefHat, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

const STORAGE_KEY = "tmpi_welcome_seen";
const DELAY_MS = 2800;

const floatingItems = [
  { emoji: "🥑", x: "8%", y: "12%", delay: 0, duration: 6 },
  { emoji: "🍗", x: "88%", y: "10%", delay: 1.2, duration: 7 },
  { emoji: "🥦", x: "5%", y: "78%", delay: 0.6, duration: 8 },
  { emoji: "🍜", x: "90%", y: "75%", delay: 1.8, duration: 6.5 },
  { emoji: "🫐", x: "50%", y: "5%", delay: 0.3, duration: 7.5 },
];

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(dismiss, 2200);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-label="Welcome to The Meal Prep Ideas"
          >
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[28px] bg-brand-cream shadow-[0_40px_100px_-20px_rgba(17,24,39,0.4)]">

              {/* Floating food emojis */}
              {floatingItems.map((item, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute text-2xl select-none"
                  style={{ left: item.x, top: item.y }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item.emoji}
                </motion.span>
              ))}

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 text-brand-light backdrop-blur transition-colors hover:bg-white hover:text-brand-heading"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {/* Header */}
              <div className="relative bg-gradient-to-br from-brand-primary-dark via-brand-primary to-[#5cb85c] px-8 pt-10 pb-8 text-center">
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[28px]">
                  <div className="absolute -left-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-8 -right-8 size-40 rounded-full bg-brand-orange/25 blur-2xl" />
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                  className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] backdrop-blur"
                >
                  <ChefHat className="size-8" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="relative mt-4 font-display text-[26px] leading-tight text-white"
                >
                  Welcome to Meal Prep Ideas
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative mt-2 text-sm text-white/85"
                >
                  100+ easy recipes to save time every week
                </motion.p>
              </div>

              {/* Body */}
              <div className="px-8 py-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 py-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="flex size-14 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary-dark"
                      >
                        <CheckCircle2 className="size-7" />
                      </motion.div>
                      <p className="font-display text-xl text-brand-heading">You&apos;re in!</p>
                      <p className="text-sm text-brand-light">Check your inbox for your free 7-day meal prep plan.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                      {/* Newsletter block */}
                      <div className="rounded-2xl border border-brand-border/60 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange/12 text-brand-orange">
                            <Mail className="size-4.5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-brand-heading">Get Your Free 7-Day Meal Plan</p>
                            <p className="text-xs text-brand-light">Join 50,000+ subscribers</p>
                          </div>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="h-11 w-full rounded-[12px] border border-brand-border/80 bg-brand-cream px-4 text-sm text-brand-heading placeholder:text-brand-light/70 focus:border-brand-primary/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                          />
                          <button
                            type="submit"
                            className="h-11 shrink-0 rounded-[12px] bg-brand-orange px-5 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(245,158,11,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#d97706] hover:shadow-[0_10px_20px_-8px_rgba(245,158,11,0.5)]"
                          >
                            Subscribe
                          </button>
                        </form>
                      </div>

                      {/* Divider */}
                      <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-brand-border/60" />
                        <span className="text-xs text-brand-light">or</span>
                        <div className="h-px flex-1 bg-brand-border/60" />
                      </div>

                      {/* Sign up block */}
                      <div className="rounded-2xl border border-brand-primary/25 bg-brand-primary/5 p-5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-primary/12 text-brand-primary-dark">
                            <Bookmark className="size-4.5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-brand-heading">Save Recipes to Your Account</p>
                            <p className="text-xs text-brand-light">Bookmark favourites, access them anywhere</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2.5">
                          <Button href="/account/signup" size="md" className="flex-1" onClick={dismiss} icon={Sparkles} iconPosition="left">
                            Create Free Account
                          </Button>
                          <Link
                            href="/account/login"
                            onClick={dismiss}
                            className="flex h-11 items-center rounded-[12px] border border-brand-border px-4 text-sm font-semibold text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
                          >
                            Log In
                          </Link>
                        </div>
                      </div>

                      <button
                        onClick={dismiss}
                        className="mt-4 w-full text-center text-xs text-brand-light/70 transition-colors hover:text-brand-light"
                      >
                        No thanks, just browsing
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
