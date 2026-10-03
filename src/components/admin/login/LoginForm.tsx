"use client";

import { useActionState } from "react";
import { ChefHat, Lock, Mail, AlertCircle } from "lucide-react";
import { signInAction, type SignInState } from "@/app/admin/actions/auth";

const initialState: SignInState = { error: null };

export default function LoginForm({ notStaffError }: { notStaffError?: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-[14px] bg-brand-primary text-white shadow-[0_8px_20px_-6px_rgba(63,163,77,0.55)]">
          <ChefHat className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl text-brand-heading">Admin Sign In</h1>
        <p className="mt-1.5 text-sm text-brand-light">The Meal Prep Ideas dashboard</p>
      </div>

      {notStaffError && (
        <div className="mt-6 flex items-center gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error">
          <AlertCircle className="size-4 shrink-0" />
          That account doesn&apos;t have admin access. Sign in with a staff email instead.
        </div>
      )}

      <form action={formAction} className="mt-8 space-y-4">
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
              placeholder="you@themealprepideas.com"
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
              type="password"
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] text-brand-heading placeholder:text-brand-light focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              placeholder="••••••••"
            />
          </div>
        </div>

        {state.error && (
          <div className="flex items-center gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-brand-primary text-[15px] font-semibold text-white transition-all duration-300 hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-brand-light">
        No public sign-up — accounts are created by an admin.
      </p>
    </div>
  );
}
