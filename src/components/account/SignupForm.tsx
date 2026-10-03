"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signUpAction, type AuthFormState } from "@/lib/customers/actions";

const initialState: AuthFormState = { error: null };

export default function SignupForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-sm"
    >
      <h1 className="font-display text-[28px] text-brand-heading">Create your account</h1>
      <p className="mt-1.5 text-sm text-brand-light">Free — save recipes, rate them, and build your own cookbook.</p>

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-brand-heading">
            Your name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] text-brand-heading placeholder:text-brand-light focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="e.g. Sara Khan"
            />
          </div>
        </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-11 text-[15px] text-brand-heading placeholder:text-brand-light focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="At least 8 characters"
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
          {pending ? "Creating account…" : "Create Account"}
          {!pending && <ArrowRight className="size-4" />}
        </button>

        <p className="text-center text-xs leading-relaxed text-brand-light">
          By signing up you agree to our recipe emails occasionally landing in your inbox. No spam, unsubscribe anytime.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-brand-light">
        Already have an account?{" "}
        <Link
          href={`/account/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-brand-primary-dark hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
