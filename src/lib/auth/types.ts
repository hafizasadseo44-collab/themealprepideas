// Shared auth types — no "server-only" so safe to import from client components.

export type Role = "admin" | "editor";

export type EditorPermissions = {
  can_posts: boolean;
  can_recipes: boolean;
  can_comments: boolean;
  can_media: boolean;
  can_publish: boolean;
};

export const DEFAULT_PERMISSIONS: EditorPermissions = {
  can_posts: true,
  can_recipes: true,
  can_comments: true,
  can_media: true,
  can_publish: true,
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  permissions: EditorPermissions | null;
  job_title: string | null;
  credentials: string | null;
  years_experience: number | null;
  expertise: string[] | null;
  website_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  pinterest_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
};

/** Returns effective permissions: admins always have everything. */
export function getEffectivePermissions(profile: Profile): EditorPermissions {
  if (profile.role === "admin") return DEFAULT_PERMISSIONS;
  return { ...DEFAULT_PERMISSIONS, ...(profile.permissions ?? {}) };
}
