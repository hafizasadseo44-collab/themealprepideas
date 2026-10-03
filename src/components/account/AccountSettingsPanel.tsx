"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, KeyRound, CheckCircle2, Mail, User, Bell, UtensilsCrossed, BookOpen, AlertTriangle, Trash2 } from "lucide-react";
import Switch from "@/components/ui/Switch";
import {
  updateOwnCustomerName,
  updateOwnCustomerPassword,
  updateOwnNotificationPrefs,
  deleteOwnCustomerAccount,
} from "@/lib/customers/mutations";
import type { Customer } from "@/lib/customers/session";

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function AccountSettingsPanel({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(customer.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const [notifyRecipes, setNotifyRecipes] = useState(customer.notify_new_recipes);
  const [notifyPosts, setNotifyPosts] = useState(customer.notify_new_posts);
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    setSaving(true);
    const result = await updateOwnCustomerName(fullName);
    setSaving(false);
    if (!result.ok) return setError(result.error);
    setSaved(true);
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    setPwSaved(false);
    if (newPassword !== confirmPassword) return setPwError("Passwords don't match.");
    setPwSaving(true);
    const result = await updateOwnCustomerPassword(newPassword);
    setPwSaving(false);
    if (!result.ok) return setPwError(result.error);
    setPwSaved(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePrefChange = async (next: { notifyRecipes: boolean; notifyPosts: boolean }) => {
    setNotifyRecipes(next.notifyRecipes);
    setNotifyPosts(next.notifyPosts);
    setPrefsSaving(true);
    await updateOwnNotificationPrefs({ notifyNewRecipes: next.notifyRecipes, notifyNewPosts: next.notifyPosts });
    setPrefsSaving(false);
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setDeleting(true);
    const result = await deleteOwnCustomerAccount();
    if (result && !result.ok) {
      setDeleting(false);
      setDeleteError(result.error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <div className="flex flex-col items-center rounded-[20px] border border-brand-border/60 bg-white p-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-dark font-display text-3xl text-white shadow-[0_12px_28px_-12px_rgba(63,163,77,0.55)]">
          {initialsOf(fullName || customer.email) || "?"}
        </span>
        <p className="mt-4 font-display text-lg text-brand-heading">{fullName || "Your Account"}</p>
        <p className="mt-0.5 truncate text-xs text-brand-light">{customer.email}</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[20px] border border-brand-border/60 bg-white p-6">
          <p className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
            <User className="size-4" />
            Your Details
          </p>

          <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-brand-light">
            <Mail className="size-3.5" />
            Email
          </label>
          <input
            type="text"
            value={customer.email}
            disabled
            className="mb-4 h-11 w-full rounded-[12px] border border-brand-border bg-brand-gray/50 px-3.5 text-sm text-brand-light"
          />

          <label className="mb-1 block text-xs font-medium text-brand-light">Display Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="h-11 w-full rounded-[12px] border border-brand-border px-3.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-brand-error"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <AnimatePresence>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary-dark"
                >
                  <CheckCircle2 className="size-4" /> Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-[20px] border border-brand-border/60 bg-white p-6">
          <p className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
            <KeyRound className="size-4" />
            Change Password
          </p>

          <label className="mb-1 block text-xs font-medium text-brand-light">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mb-4 h-11 w-full rounded-[12px] border border-brand-border px-3.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />

          <label className="mb-1 block text-xs font-medium text-brand-light">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 w-full rounded-[12px] border border-brand-border px-3.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />

          <AnimatePresence>
            {pwError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-brand-error"
              >
                {pwError}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={pwSaving || !newPassword}
              className="flex h-11 items-center gap-2 rounded-[12px] border border-brand-border px-5 text-sm font-semibold text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark disabled:opacity-60"
            >
              {pwSaving ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
            <AnimatePresence>
              {pwSaved && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1 text-sm text-brand-primary-dark"
                >
                  <CheckCircle2 className="size-4" /> Password updated
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-[20px] border border-brand-border/60 bg-white p-6">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
            <Bell className="size-4" />
            Email Notifications
          </p>
          <p className="mb-4 text-xs text-brand-light">Choose what we email you about. You can turn either off anytime.</p>

          <div className="flex items-center justify-between gap-4 border-b border-brand-border/50 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-primary/10 text-brand-primary-dark">
                <UtensilsCrossed className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-brand-heading">New Recipes</p>
                <p className="text-xs text-brand-light">An email whenever a new recipe is published</p>
              </div>
            </div>
            <Switch
              checked={notifyRecipes}
              disabled={prefsSaving}
              onChange={(value) => handlePrefChange({ notifyRecipes: value, notifyPosts })}
              label="Email me about new recipes"
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-orange/15 text-brand-orange-deep">
                <BookOpen className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-brand-heading">Blog &amp; Category Updates</p>
                <p className="text-xs text-brand-light">An email for new articles and new categories</p>
              </div>
            </div>
            <Switch
              checked={notifyPosts}
              disabled={prefsSaving}
              onChange={(value) => handlePrefChange({ notifyRecipes, notifyPosts: value })}
              label="Email me about blog and category updates"
            />
          </div>
        </div>

        <div className="rounded-[20px] border border-brand-error/30 bg-brand-error/5 p-6">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-brand-error">
            <AlertTriangle className="size-4" />
            Danger Zone
          </p>
          <p className="mb-4 text-xs text-brand-light">
            Permanently delete your account and all your saved recipes. This can&apos;t be undone.
          </p>

          {deleteError && <p className="mb-3 text-sm text-brand-error">{deleteError}</p>}

          {confirmingDelete ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-brand-heading">Are you sure?</p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-10 items-center gap-2 rounded-[10px] bg-brand-error px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="h-10 rounded-[10px] border border-brand-border px-4 text-sm font-medium text-brand-body hover:bg-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex h-10 items-center gap-2 rounded-[10px] border border-brand-error/40 px-4 text-sm font-semibold text-brand-error transition-colors hover:bg-brand-error/10"
            >
              <Trash2 className="size-4" />
              Delete My Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
