"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Loader2, Save, ImagePlus, X, KeyRound, CheckCircle2,
  Globe, Twitter, Instagram, Facebook, Linkedin, Youtube,
  Award, Star, Briefcase, Tag, Info, ExternalLink,
} from "lucide-react";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { updateOwnProfile, updateOwnPassword } from "@/lib/profile/mutations";
import type { Profile } from "@/lib/auth/session";
import type { MediaItem } from "@/lib/media/upload";

// Pinterest is not in lucide — use a simple P icon
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-brand-heading">{label}</label>
      {hint && <p className="mb-1.5 text-[11px] text-brand-light">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
    />
  );
}

function SocialInput({ icon: Icon, value, onChange, placeholder }: { icon: React.FC<{ className?: string }>; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-brand-border pl-8 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
      />
    </div>
  );
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  // Basic
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [pickerOpen, setPickerOpen] = useState(false);

  // E-E-A-T
  const [jobTitle, setJobTitle] = useState(profile.job_title ?? "");
  const [credentials, setCredentials] = useState(profile.credentials ?? "");
  const [yearsExperience, setYearsExperience] = useState(String(profile.years_experience ?? ""));
  const [expertise, setExpertise] = useState((profile.expertise ?? []).join(", "));

  // Socials
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url ?? "");
  const [twitterUrl, setTwitterUrl] = useState(profile.twitter_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url ?? "");
  const [facebookUrl, setFacebookUrl] = useState(profile.facebook_url ?? "");
  const [pinterestUrl, setPinterestUrl] = useState(profile.pinterest_url ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(profile.youtube_url ?? "");

  // Status
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    setSaving(true);
    const result = await updateOwnProfile({
      fullName, bio, avatarUrl,
      jobTitle, credentials, yearsExperience, expertise,
      websiteUrl, twitterUrl, instagramUrl, facebookUrl,
      pinterestUrl, linkedinUrl, youtubeUrl,
    });
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
    <div className="space-y-6">

      {/* Top: Avatar + basic info side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

        {/* Avatar card */}
        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Profile Photo</p>
          <div className="relative mx-auto size-32 overflow-hidden rounded-full bg-brand-primary/12 ring-4 ring-brand-primary/10">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={fullName || profile.email} fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-4xl text-brand-primary-dark">
                {(fullName || profile.email).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <button type="button" onClick={() => setPickerOpen(true)} className="flex items-center gap-1.5 rounded-[10px] border border-brand-border px-3 py-2 text-xs font-medium text-brand-body hover:border-brand-primary/50 hover:text-brand-primary-dark">
              <ImagePlus className="size-3.5" /> Change
            </button>
            {avatarUrl && (
              <button type="button" onClick={() => setAvatarUrl(null)} className="flex items-center gap-1.5 rounded-[10px] border border-brand-border px-3 py-2 text-xs font-medium text-brand-error hover:bg-brand-error/8">
                <X className="size-3.5" /> Remove
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

          <div className="mt-4 border-t border-brand-border/60 pt-4">
            <p className="text-[11px] text-brand-light text-center">
              Public author page:
            </p>
            <a
              href={`/authors/${profile.id}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-primary-dark hover:underline"
            >
              <ExternalLink className="size-3" />
              View your author page
            </a>
          </div>
        </div>

        {/* Basic + E-E-A-T */}
        <div className="space-y-5">

          {/* Basic Details */}
          <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
            <p className="mb-4 text-sm font-semibold text-brand-heading">Basic Details</p>
            <div className="space-y-4">
              <Field label="Email">
                <input type="text" value={profile.email} disabled className="h-10 w-full rounded-[10px] border border-brand-border bg-brand-gray/50 px-3 text-sm text-brand-light" />
              </Field>
              <Field label="Display Name" hint="Shown on recipes and articles as author name">
                <TextInput value={fullName} onChange={setFullName} placeholder="Your full name" />
              </Field>
              <Field label="Bio" hint="Short paragraph — shown on your public author page and below articles">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a 2-3 sentence bio about your background, passion for meal prep, and what readers can expect from your recipes…"
                  rows={4}
                  className="w-full resize-none rounded-[10px] border border-brand-border px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                />
              </Field>
            </div>
          </div>

          {/* E-E-A-T Expertise */}
          <div className="rounded-[18px] border border-brand-primary/20 bg-gradient-to-br from-brand-primary/3 to-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Award className="size-4 text-brand-primary-dark" />
              <p className="text-sm font-semibold text-brand-heading">Expertise & Credentials</p>
              <span className="ml-auto rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-primary-dark">
                Google E-E-A-T
              </span>
            </div>
            <p className="mb-4 rounded-[10px] bg-brand-primary/6 px-3 py-2 text-[12px] leading-relaxed text-brand-primary-dark">
              <Info className="mr-1 inline size-3.5" />
              These signals tell Google you are a real expert in your field — they improve your recipe and article rankings.
            </p>
            <div className="space-y-4">
              <Field label="Professional Title" hint='e.g. "Certified Meal Prep Coach", "Registered Dietitian", "Food Blogger & Recipe Developer"'>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Meal Prep Expert & Recipe Developer"
                    className="h-10 w-full rounded-[10px] border border-brand-border pl-8 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                  />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Certifications / Degrees" hint='e.g. "RD, MS Nutrition" or "ACE Certified"'>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
                    <input
                      type="text"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      placeholder="RD, MS, ACE Certified"
                      className="h-10 w-full rounded-[10px] border border-brand-border pl-8 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                    />
                  </div>
                </Field>
                <Field label="Years of Experience">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="e.g. 7"
                    className="h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                  />
                </Field>
              </div>
              <Field label="Expertise Topics (comma separated)" hint='e.g. "High-Protein Cooking, Meal Prep Planning, Weight Loss Meals, Keto Recipes"'>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-light" />
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="High-Protein Cooking, Meal Prep Planning, Weight Loss Recipes"
                    className="h-10 w-full rounded-[10px] border border-brand-border pl-8 pr-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10"
                  />
                </div>
              </Field>
            </div>
          </div>

        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-brand-heading">Social Media & Website</p>
        <p className="mb-4 text-[12px] text-brand-light">Links shown on your public author page — builds authority and trust signals for Google.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Website / Personal Blog">
            <SocialInput icon={Globe} value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://yoursite.com" />
          </Field>
          <Field label="LinkedIn">
            <SocialInput icon={Linkedin} value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/yourname" />
          </Field>
          <Field label="Instagram">
            <SocialInput icon={Instagram} value={instagramUrl} onChange={setInstagramUrl} placeholder="https://instagram.com/yourhandle" />
          </Field>
          <Field label="Pinterest">
            <SocialInput icon={PinterestIcon} value={pinterestUrl} onChange={setPinterestUrl} placeholder="https://pinterest.com/yourhandle" />
          </Field>
          <Field label="X / Twitter">
            <SocialInput icon={Twitter} value={twitterUrl} onChange={setTwitterUrl} placeholder="https://x.com/yourhandle" />
          </Field>
          <Field label="Facebook">
            <SocialInput icon={Facebook} value={facebookUrl} onChange={setFacebookUrl} placeholder="https://facebook.com/yourpage" />
          </Field>
          <Field label="YouTube">
            <SocialInput icon={Youtube} value={youtubeUrl} onChange={setYoutubeUrl} placeholder="https://youtube.com/@yourchannel" />
          </Field>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(63,163,77,0.6)] transition-all hover:-translate-y-0.5 hover:bg-brand-primary-dark disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {saving ? "Saving…" : "Save Profile"}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-dark">
            <CheckCircle2 className="size-4" /> Profile saved successfully
          </span>
        )}
        {error && <p className="text-sm text-brand-error">{error}</p>}
      </div>

      {/* Change Password */}
      <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
        <p className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
          <KeyRound className="size-4" />
          Change Password
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="New Password">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className="h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none" />
          </Field>
          <Field label="Confirm Password">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10 w-full rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none" />
          </Field>
        </div>
        {pwError && <p className="mt-2 text-sm text-brand-error">{pwError}</p>}
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={pwSaving || !newPassword}
            className="flex h-10 items-center gap-2 rounded-[10px] border border-brand-border px-4 text-sm font-semibold text-brand-body transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark disabled:opacity-60"
          >
            {pwSaving ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
          {pwSaved && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-dark"><CheckCircle2 className="size-4" /> Password updated</span>}
        </div>
      </div>
    </div>
  );
}
