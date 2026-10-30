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
