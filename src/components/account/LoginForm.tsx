"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { signInAction, type AuthFormState } from "@/lib/customers/actions";

const initialState: AuthFormState = { error: null };

export default function LoginForm({ next, confirm }: { next: string; confirm: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-sm"
    >
      <h1 className="font-display text-[28px] text-brand-heading">Welcome back</h1>
      <p className="mt-1.5 text-sm text-brand-light">Sign in to save recipes and pick up where you left off.</p>

      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 flex items-start gap-2.5 overflow-hidden rounded-[14px] bg-brand-primary/10 px-4 py-3.5 text-sm text-brand-primary-dark"
          >
            <CheckCircle2 className="mt-0.5 size-4.5 shrink-0" />
            <span>Account created — check your email to confirm, then sign in below.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-heading">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] text-brand-heading placeholder:text-brand-light focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand-heading">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-11 text-[15px] text-brand-heading placeholder:text-brand-light focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-light transition-colors hover:text-brand-heading"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error"
            >
              <AlertCircle className="size-4 shrink-0" />
              {state.error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-brand-primary text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {pending ? "Signing in…" : "Sign In"}
          {!pending && <ArrowRight className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-light">
        New here?{" "}
        <Link
          href={`/account/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-brand-primary-dark hover:underline"
        >
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
