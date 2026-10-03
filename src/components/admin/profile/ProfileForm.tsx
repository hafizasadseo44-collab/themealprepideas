"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Save, ImagePlus, X, KeyRound, CheckCircle2 } from "lucide-react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { updateOwnProfile, updateOwnPassword } from "@/lib/profile/mutations";
import type { Profile } from "@/lib/auth/session";
import type { MediaItem } from "@/lib/media/upload";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    setSaving(true);
    const result = await updateOwnProfile({ fullName, bio, avatarUrl });
    setSaving(false);
    if (!result.ok) return setError(result.error);
    setSaved(true);
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    setPwSaved(false);
    if (newPassword !== confirmPassword) return setPwError("Passwords don't match.");
    setPwSaving(true);
    const result = await updateOwnPassword(newPassword);
    setPwSaving(false);
    if (!result.ok) return setPwError(result.error);
    setPwSaved(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Avatar */}
      <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-brand-heading">Photo</p>
        <div className="relative mx-auto size-32 overflow-hidden rounded-full bg-brand-primary/12">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName || profile.email} fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-4xl text-brand-primary-dark">
              {(fullName || profile.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 rounded-[10px] border border-brand-border px-3 py-2 text-xs font-medium text-brand-body hover:border-brand-primary/50 hover:text-brand-primary-dark"
          >
            <ImagePlus className="size-3.5" />
            Change
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl(null)}
              className="flex items-center gap-1.5 rounded-[10px] border border-brand-border px-3 py-2 text-xs font-medium text-brand-error hover:bg-brand-error/8"
            >
              <X className="size-3.5" />
              Remove
            </button>
          )}
        </div>
        <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(item: MediaItem) => setAvatarUrl(item.url)} />

        <div className="mt-5 border-t border-brand-border/60 pt-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-light">Role</p>
          <p className="mt-1 inline-flex rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-primary-dark">
            {profile.role}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-4 text-sm font-semibold text-brand-heading">Your Details</p>

          <label className="mb-1 block text-xs font-medium text-brand-light">Email</label>
          <input
            type="text"
            value={profile.email}
            disabled
            className="mb-4 h-10 w-full rounded-[10px] border border-brand-border bg-brand-gray/50 px-3 text-sm text-brand-light"
          />

          <label className="mb-1 block text-xs font-medium text-brand-light">Display Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name, shown on articles"
            className="mb-4 h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
          />

          <label className="mb-1 block text-xs font-medium text-brand-light">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short author bio shown at the end of your articles…"
            rows={3}
            className="w-full resize-none rounded-[10px] border border-brand-border px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
          />

          {error && <p className="mt-3 text-sm text-brand-error">{error}</p>}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex h-10 items-center gap-2 rounded-[10px] bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <span className="ml-3 inline-flex items-center gap-1 text-sm text-brand-primary-dark">
              <CheckCircle2 className="size-4" /> Saved
            </span>
          )}
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
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
            className="mb-4 h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
          />

          <label className="mb-1 block text-xs font-medium text-brand-light">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-10 rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
          />

          {pwError && <p className="mt-3 text-sm text-brand-error">{pwError}</p>}

          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={pwSaving || !newPassword}
            className="mt-4 flex h-10 items-center gap-2 rounded-[10px] border border-brand-border px-4 text-sm font-semibold text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark disabled:opacity-60"
          >
            {pwSaving ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
          {pwSaved && (
            <span className="ml-3 inline-flex items-center gap-1 text-sm text-brand-primary-dark">
              <CheckCircle2 className="size-4" /> Password updated
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
