"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Sparkles, ChefHat } from "lucide-react";

const STORAGE_KEY = "tmpi_welcome_v2";
const DELAY_MS = 6000;

const FLOATING = ["🥑", "🍗", "🥦", "🍜", "🫐", "🥕", "🌿", "🍋"];

export default function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    timerRef.current = setTimeout(() => setShow(true), DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function dismiss() {
    setShow(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubscribed(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setTimeout(dismiss, 2200);
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-[6px]"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.86, y: 48 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.9 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-[20px] sm:rounded-[28px] bg-white shadow-[0_32px_80px_-16px_rgba(17,24,39,0.35)]">

              {/* ── Hero header ── */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1b5e20] via-[#2e7d32] to-[#3fa34d] px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 text-white">

                {/* Animated blobs */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full bg-white/20 blur-2xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.22, 1], opacity: [0.12, 0.26, 0.12] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="pointer-events-none absolute -left-8 bottom-0 size-40 rounded-full bg-[#f59e0b]/30 blur-2xl"
                />

                {/* Floating food emojis */}
                {FLOATING.map((emoji, i) => (
                  <motion.span
                    key={emoji}
                    className="pointer-events-none absolute select-none text-lg"
                    style={{
                      left: `${8 + (i % 4) * 24}%`,
                      top: `${12 + Math.floor(i / 4) * 55}%`,
                    }}
                    animate={{ y: [0, -8, 0], opacity: [0.55, 0.9, 0.55] }}
                    transition={{ duration: 2.8 + i * 0.35, repeat: Infinity, delay: i * 0.22 }}
                  >
                    {emoji}
                  </motion.span>
                ))}

                {/* Close button */}
                <button
                  onClick={dismiss}
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/15 text-white/80 transition-all hover:bg-white/25 hover:text-white"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>

                {/* Brand icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="relative z-10 mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm"
                >
                  <ChefHat className="size-7 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative z-10"
                >
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                    The Meal Prep Ideas
                  </p>
                  <h2 className="font-display text-[22px] sm:text-[28px] leading-tight text-white">
                    Meal prep just got<br />
                    <span className="text-[#fcd34d]">deliciously easy.</span>
                  </h2>
                  <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-white/80">
                    100+ healthy recipes · weekly plans · expert guides
                  </p>
                </motion.div>
              </div>

              {/* ── Body ── */}
              <div className="px-5 py-5 sm:px-8 sm:py-7">

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mb-6 flex items-center justify-between rounded-2xl bg-[#f0faf1] px-5 py-3.5"
                >
                  {[
                    { num: "100+", label: "Recipes" },
                    { num: "5★", label: "Rated" },
                    { num: "Free", label: "Always" },
                  ].map(({ num, label }) => (
                    <div key={label} className="text-center">
                      <p className="font-display text-[20px] leading-none text-[#2e7d32]">{num}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-[#4a7c59]">{label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Subscribe form */}
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-2 py-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="flex size-14 items-center justify-center rounded-full bg-[#3fa34d]"
                      >
                        <Check className="size-7 text-white" />
                      </motion.div>
                      <p className="mt-2 font-display text-[18px] text-[#1b5e20]">You're in! 🎉</p>
                      <p className="text-sm text-gray-500">Check your inbox for delicious meal plans.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="mb-3 text-[13px] font-semibold text-gray-700">
                        Get weekly meal plans — free in your inbox:
                      </p>
                      <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[14px] outline-none transition-all focus:border-[#3fa34d] focus:bg-white focus:ring-2 focus:ring-[#3fa34d]/20 sm:flex-1"
                          required
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#f59e0b] px-5 text-[13px] font-bold text-white shadow-[0_4px_14px_-4px_rgba(245,158,11,0.6)] transition-all hover:bg-[#d97706] hover:shadow-[0_6px_18px_-4px_rgba(245,158,11,0.7)] active:scale-95 disabled:opacity-70 sm:w-auto"
                        >
                          {loading ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                              className="inline-block size-4 rounded-full border-2 border-white border-t-transparent"
                            />
                          ) : (
                            <>Join <ArrowRight className="size-3.5" /></>
                          )}
                        </button>
                      </form>

                      {/* Divider */}
                      <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">or</span>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>

                      {/* Sign up CTA */}
                      <a
                        href="/sign-up"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#3fa34d]/30 bg-[#f0faf1] py-3 text-[14px] font-bold text-[#2e7d32] transition-all hover:border-[#3fa34d] hover:bg-[#e8f5e9] hover:shadow-md"
                      >
                        <Sparkles className="size-4 text-[#f59e0b]" />
                        Create free account — save your recipes
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dismiss */}
                <button
                  onClick={dismiss}
                  className="mt-4 w-full text-center text-[12px] text-gray-400 transition-colors hover:text-gray-600"
                >
                  No thanks, I'll just browse
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
