"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Loader2, Trash2, Send, ShieldCheck } from "lucide-react";
import { inviteUser, updateUserRole, removeUser } from "@/lib/users/mutations";
import type { StaffUser } from "@/lib/users/queries";
import type { Role } from "@/lib/auth/session";

function UserRow({ user, isSelf, onChanged, onRemoved }: { user: StaffUser; isSelf: boolean; onChanged: (u: StaffUser) => void; onRemoved: (id: string) => void }) {
  const [changingRole, setChangingRole] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex items-center gap-3 border-b border-brand-border/40 px-5 py-3.5 last:border-0">
      <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-brand-primary/12">
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt={user.email} fill sizes="36px" className="object-cover" />
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
        {error && <p className="mt-1 text-xs text-brand-error">{error}</p>}
      </div>

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
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-brand-light hover:bg-brand-error/10 hover:text-brand-error disabled:opacity-30"
        aria-label="Remove user"
      >
        {removing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>
    </div>
  );
}

export default function UserManagement({ users: initial, currentUserId }: { users: StaffUser[]; currentUserId: string | null }) {
  const [users, setUsers] = useState(initial);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = async () => {
    setInviteError(null);
    setInviteSent(false);
    if (!email.trim()) return;
    setInviting(true);
    const result = await inviteUser(email, role);
    setInviting(false);
    if (!result.ok) return setInviteError(result.error);
    setInviteSent(true);
    setEmail("");
  };

  return (
    <div>
      <div className="mb-6 rounded-[16px] border border-brand-border/60 bg-white p-4">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
          <Mail className="size-4" />
          Invite a Writer
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            <option value="admin">Admin</option>
          </select>
          <button
            type="button"
            onClick={handleInvite}
            disabled={inviting}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {inviting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Invite
          </button>
        </div>
        {inviteError && <p className="mt-2 text-sm text-brand-error">{inviteError}</p>}
        {inviteSent && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-primary-dark">
            <ShieldCheck className="size-4" /> Invite sent — they&apos;ll get an email to set their password.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-[16px] border border-brand-border/60 bg-white">
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
