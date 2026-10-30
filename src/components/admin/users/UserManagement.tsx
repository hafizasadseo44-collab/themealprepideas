"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail, Loader2, Trash2, Send, ShieldCheck, ChevronDown, ChevronUp,
  FileText, UtensilsCrossed, MessageCircle, ImageIcon, Globe, Shield,
} from "lucide-react";
import { inviteUser, updateUserRole, removeUser, updateUserPermissions } from "@/lib/users/mutations";
import type { StaffUser } from "@/lib/users/queries";
import type { Role, EditorPermissions } from "@/lib/auth/types";
import { DEFAULT_PERMISSIONS } from "@/lib/auth/types";

type PermissionKey = keyof EditorPermissions;

const PERM_DEFS: { key: PermissionKey; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "can_posts",    label: "Blog Posts",    desc: "Write & edit blog articles",       icon: <FileText className="size-4" /> },
  { key: "can_recipes",  label: "Recipes",       desc: "Write & edit recipe pages",        icon: <UtensilsCrossed className="size-4" /> },
  { key: "can_comments", label: "Comments",      desc: "Moderate reader comments",         icon: <MessageCircle className="size-4" /> },
  { key: "can_media",    label: "Media Library", desc: "Upload & manage images",           icon: <ImageIcon className="size-4" /> },
  { key: "can_publish",  label: "Can Publish",   desc: "Publish live (vs draft-only)",     icon: <Globe className="size-4" /> },
];

function PermissionToggle({
  pkey, label, desc, icon, checked, onChange,
}: { pkey: PermissionKey; label: string; desc: string; icon: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label key={pkey} className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-3 transition-all ${checked ? "border-brand-primary/40 bg-brand-primary/5" : "border-brand-border/60 bg-white"}`}>
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${checked ? "bg-brand-primary/10 text-brand-primary-dark" : "bg-brand-gray text-brand-light"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-brand-heading">{label}</p>
        <p className="text-[11px] text-brand-light">{desc}</p>
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${checked ? "bg-brand-primary" : "bg-brand-border"}`}
      >
        <span className={`absolute size-3.5 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-[2px]"}`} />
      </div>
    </label>
  );
}

function UserRow({ user, isSelf, onChanged, onRemoved }: {
  user: StaffUser;
  isSelf: boolean;
  onChanged: (u: StaffUser) => void;
  onRemoved: (id: string) => void;
}) {
  const [changingRole, setChangingRole] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPerms, setShowPerms] = useState(false);
  const [perms, setPerms] = useState<EditorPermissions>(
    user.permissions ?? DEFAULT_PERMISSIONS
  );
  const [savingPerms, setSavingPerms] = useState(false);

  const handleRoleChange = async (role: Role) => {
    setError(null);
    setChangingRole(true);
    const result = await updateUserRole(user.id, role);
    setChangingRole(false);
    if (!result.ok) return setError(result.error);
    onChanged({ ...user, role });
  };

  const handleRemove = async () => {
    if (!confirm(`Remove ${user.email}? They will lose access immediately.`)) return;
    setRemoving(true);
    const result = await removeUser(user.id);
    setRemoving(false);
    if (!result.ok) return setError(result.error);
    onRemoved(user.id);
  };

  const handleSavePerms = async () => {
    setSavingPerms(true);
    const result = await updateUserPermissions(user.id, perms);
    setSavingPerms(false);
    if (!result.ok) return setError(result.error);
    onChanged({ ...user, permissions: perms });
    setShowPerms(false);
  };

  return (
    <div className="border-b border-brand-border/40 last:border-0">
      <div className="flex items-center gap-3 px-5 py-3.5">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-brand-primary/10">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.email} fill sizes="40px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-primary-dark">
              {(user.fullName || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-brand-heading">
            {user.fullName || user.email.split("@")[0]}
            {isSelf && <span className="ml-1.5 text-xs font-normal text-brand-light">(you)</span>}
          </p>
          <p className="truncate text-xs text-brand-light">{user.email}</p>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user.role === "editor" && !isSelf && (
            <button
              type="button"
              onClick={() => setShowPerms((v) => !v)}
              className="flex items-center gap-1 rounded-lg border border-brand-border/60 bg-white px-2.5 py-1.5 text-[11px] font-medium text-brand-body transition-colors hover:bg-brand-gray"
            >
              <Shield className="size-3.5 text-brand-primary-dark" />
              Perms
              {showPerms ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
          )}

          <select
            value={user.role}
            disabled={isSelf || changingRole}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            className="h-9 shrink-0 rounded-[8px] border border-brand-border bg-white px-2 text-xs font-medium disabled:opacity-50"
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isSelf || removing}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-brand-light hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
            aria-label="Remove user"
          >
            {removing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Permissions panel */}
      {showPerms && user.role === "editor" && (
        <div className="mx-5 mb-4 rounded-[14px] border border-brand-border/40 bg-brand-gray/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-light">Editor Access</p>
          <div className="space-y-2">
            {PERM_DEFS.map((p) => (
              <PermissionToggle
                key={p.key}
                pkey={p.key}
                label={p.label}
                desc={p.desc}
                icon={p.icon}
                checked={perms[p.key]}
                onChange={(v) => setPerms((prev) => ({ ...prev, [p.key]: v }))}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleSavePerms}
            disabled={savingPerms}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {savingPerms ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Save permissions
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserManagement({ users: initial, currentUserId }: { users: StaffUser[]; currentUserId: string | null }) {
  const [users, setUsers] = useState(initial);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [permissions, setPermissions] = useState<EditorPermissions>(DEFAULT_PERMISSIONS);
  const [showPermPanel, setShowPermPanel] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = async () => {
    setInviteError(null);
    setInviteSent(false);
    if (!email.trim()) return;
    setInviting(true);
    const result = await inviteUser(email.trim(), role, role === "editor" ? permissions : undefined);
    setInviting(false);
    if (!result.ok) return setInviteError(result.error);
    setInviteSent(true);
    setEmail("");
    setRole("editor");
    setPermissions(DEFAULT_PERMISSIONS);
    setShowPermPanel(false);
  };

  return (
    <div>
      {/* Invite card */}
      <div className="mb-6 overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-sm">
        <div className="p-5">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
            <Mail className="size-4 text-brand-primary-dark" />
            Invite a Team Member
          </p>
          <p className="mb-4 text-xs text-brand-light">They&apos;ll receive an email to set their password and access the dashboard.</p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (e.target.value) setShowPermPanel(true); }}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              placeholder="writer@example.com"
              className="h-10 min-w-0 flex-1 rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="h-10 shrink-0 rounded-[10px] border border-brand-border bg-white px-3 text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin (full access)</option>
            </select>
            <button
              type="button"
              onClick={handleInvite}
              disabled={inviting || !email.trim()}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-50"
            >
              {inviting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send Invite
            </button>
          </div>

          {inviteError && <p className="mt-2 text-sm text-red-500">{inviteError}</p>}
          {inviteSent && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-primary-dark">
              <ShieldCheck className="size-4" /> Invite sent — they&apos;ll get an email to set their password.
            </p>
          )}
        </div>

        {/* Editor permissions panel — shown when email is entered and role is editor */}
        {showPermPanel && role === "editor" && (
          <div className="border-t border-brand-border/40 bg-brand-gray/30 p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-light">What can this editor access?</p>
            <p className="mb-3 text-[11px] text-brand-light">Admins always have full access. These settings only apply to editors.</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PERM_DEFS.map((p) => (
                <PermissionToggle
                  key={p.key}
                  pkey={p.key}
                  label={p.label}
                  desc={p.desc}
                  icon={p.icon}
                  checked={permissions[p.key]}
                  onChange={(v) => setPermissions((prev) => ({ ...prev, [p.key]: v }))}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="overflow-hidden rounded-[20px] border border-brand-border/60 bg-white shadow-sm">
        <div className="border-b border-brand-border/40 px-5 py-3">
          <p className="text-sm font-semibold text-brand-heading">Team Members</p>
          <p className="text-xs text-brand-light">{users.length} {users.length === 1 ? "person has" : "people have"} access to the dashboard</p>
        </div>
        {users.map((u) => (
          <UserRow
            key={u.id}
            user={u}
            isSelf={u.id === currentUserId}
            onChanged={(updated) => setUsers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
            onRemoved={(id) => setUsers((prev) => prev.filter((p) => p.id !== id))}
          />
        ))}
      </div>
    </div>
  );
}
