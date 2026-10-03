"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Tag, MessageSquare, Send, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/lib/contact/actions";

const subjects = ["General Question", "Recipe Feedback", "Recipe Request", "Partnership / Press", "Something's Not Working", "Other"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await submitContactForm({ name, email, subject, message, honeypot: website });
    setSubmitting(false);

    if (!result.ok) return setError(result.error);

    setDone(true);
    setName("");
    setEmail("");
    setSubject(subjects[0]);
    setMessage("");
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 rounded-[24px] border border-brand-border/60 bg-white p-10 text-center"
      >
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark"
        >
          <CheckCircle2 className="size-8" />
        </motion.span>
        <div>
          <p className="font-display text-xl text-brand-heading">Message sent!</p>
          <p className="mt-1.5 max-w-sm text-sm text-brand-light">
            Thanks for reaching out — check your inbox for a confirmation, and we&apos;ll get back to you within
            1-2 business days.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 text-sm font-semibold text-brand-primary-dark hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] border border-brand-border/60 bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-heading">Your name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g. Sara Khan"
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-heading">Your email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="h-12 w-full rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-brand-heading">Subject</label>
        <div className="relative">
          <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-light" />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-12 w-full appearance-none rounded-[14px] border border-brand-border bg-white pl-11 pr-4 text-[15px] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-brand-heading">Message</label>
        <div className="relative">
          <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-brand-light" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            maxLength={4000}
            placeholder="Tell us what's on your mind…"
            className="w-full resize-none rounded-[14px] border border-brand-border bg-white py-3 pl-11 pr-4 text-[15px] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      </div>

      {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] size-px opacity-0"
        aria-hidden="true"
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs text-brand-light">
          <ShieldCheck className="size-3.5" />
          We&apos;ll only use this to reply to you.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 items-center gap-2 rounded-[14px] bg-brand-primary px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(63,163,77,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {submitting ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
