"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChefHat, Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in the URL hash first (e.g. otp_expired)
    const hash = window.location.hash;
    if (hash.includes("error=")) {
      const params = new URLSearchParams(hash.slice(1));
      const code = params.get("error_code") ?? "";
      const desc = params.get("error_description") ?? "Invalid or expired invite link.";
      if (code === "otp_expired") {
        setLinkError("This invite link has expired. Please ask an admin to resend the invite.");
      } else {
        setLinkError(decodeURIComponent(desc.replace(/\+/g, " ")));
      }
      return;
    }

    const supabase = createClient();

    // Register listener FIRST so we don't miss the event
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY" || event === "USER_UPDATED") {
        setSessionReady(true);
      }
    });

    // Supabase may not auto-exchange invite tokens from hash — do it explicitly.
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken) {
      // Exchange the tokens; this fires onAuthStateChange with SIGNED_IN
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken ?? "" })
        .then(({ data, error }) => {
          if (!error && data.session) setSessionReady(true);
          else if (error) setLinkError("Invalid or expired invite link. Please ask an admin to resend.");
        });
    } else {
      // No hash tokens — check if a session already exists (e.g. page refresh)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setSessionReady(true);
        else setLinkError("No invite token found. Please use the link from your invitation email.");
      });
    }

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) return setError(updateError.message);

    setDone(true);
    setTimeout(() => router.push("/admin"), 1800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#edf7ee] to-[#f0fdf4] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg">
            <ChefHat className="size-7" />
          </div>
          <div className="text-center">
            <p className="font-display text-xl text-brand-heading">Meal Prep Ideas</p>
            <p className="text-sm text-brand-light">Admin Dashboard</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-brand-border/60 bg-white shadow-[0_20px_60px_-12px_rgba(17,24,39,0.15)]">
          {linkError ? (
            <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
              <AlertCircle className="size-14 text-red-400" />
              <div>
                <p className="font-display text-xl text-brand-heading">Link expired</p>
                <p className="mt-2 text-sm text-brand-light">{linkError}</p>
              </div>
              <a
                href="/admin/login"
                className="mt-2 text-sm font-semibold text-brand-primary hover:underline"
              >
                Go to Admin Login →
              </a>
            </div>
          ) : done ? (
            <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
              <CheckCircle className="size-14 text-brand-primary" />
              <p className="font-display text-xl text-brand-heading">Password set!</p>
              <p className="text-sm text-brand-light">Taking you to the dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-8 py-8">
              <h1 className="mb-1 font-display text-[22px] text-brand-heading">Set your password</h1>
              <p className="mb-7 text-sm text-brand-light">
                {sessionReady
                  ? "Choose a secure password to access your admin account."
                  : "Loading your invite link…"}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-heading">
                    New password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      disabled={!sessionReady}
                      className="h-11 w-full rounded-[10px] border border-brand-border bg-brand-gray/40 pl-10 pr-10 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light hover:text-brand-heading"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-heading">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      required
                      disabled={!sessionReady}
                      className="h-11 w-full rounded-[10px] border border-brand-border bg-brand-gray/40 pl-10 pr-4 text-sm outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !sessionReady}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-primary text-sm font-semibold text-white transition hover:bg-brand-primary-dark disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {loading ? "Setting password…" : "Set password & go to dashboard"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
