"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU_ICON_OPTIONS } from "@/lib/menu/icons";
import {
  createMenuGroup,
  updateMenuGroup,
  deleteMenuGroup,
  moveMenuGroup,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  moveMenuItem,
} from "@/lib/menu/mutations";
import type { MenuGroup, MenuItem } from "@/lib/menu/types";

const ICON_NAMES = Object.keys(MENU_ICON_OPTIONS);

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const Icon = MENU_ICON_OPTIONS[value] ?? MENU_ICON_OPTIONS.Tag;
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-primary/10 text-brand-primary-dark">
        <Icon className="size-4" />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 flex-1 rounded-[8px] border border-brand-border bg-white px-2 text-sm focus:border-brand-primary focus:outline-none"
      >
        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ItemRow({ item, onSaved }: { item: MenuItem; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href);
  const [icon, setIcon] = useState(item.icon);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Icon = MENU_ICON_OPTIONS[item.icon] ?? MENU_ICON_OPTIONS.Tag;

  const save = async () => {
    setBusy(true);
    setError(null);
    const result = await updateMenuItem(item.id, label, href, icon);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm(`Delete "${item.label}" from this menu?`)) return;
    setBusy(true);
    await deleteMenuItem(item.id);
    setBusy(false);
    onSaved();
  };

  const move = async (direction: "up" | "down") => {
    setBusy(true);
    await moveMenuItem(item.id, item.groupId, direction);
    setBusy(false);
    onSaved();
  };

  if (editing) {
    return (
      <div className="space-y-2 rounded-[10px] border border-brand-primary/40 bg-brand-primary/5 p-3">
        <IconSelect value={icon} onChange={setIcon} />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="h-9 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
        />
        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="/link-path or #anchor"
          className="h-9 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
        />
        {error && <p className="text-xs text-brand-error">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="flex h-8 items-center gap-1 rounded-[8px] bg-brand-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={busy}
            className="flex h-8 items-center gap-1 rounded-[8px] border border-brand-border px-3 text-xs font-semibold text-brand-body"
          >
            <X className="size-3.5" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 hover:bg-brand-gray/60">
      <Icon className="size-3.5 shrink-0 text-brand-light" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-brand-body">{item.label}</p>
        <p className="truncate text-[11px] text-brand-light">{item.href}</p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <button type="button" onClick={() => move("up")} disabled={busy} className="rounded p-1 text-brand-light hover:text-brand-heading">
          <ChevronUp className="size-3.5" />
        </button>
        <button type="button" onClick={() => move("down")} disabled={busy} className="rounded p-1 text-brand-light hover:text-brand-heading">
          <ChevronDown className="size-3.5" />
        </button>
        <button type="button" onClick={() => setEditing(true)} disabled={busy} className="rounded p-1 text-brand-light hover:text-brand-primary-dark">
          <Pencil className="size-3.5" />
        </button>
        <button type="button" onClick={remove} disabled={busy} className="rounded p-1 text-brand-light hover:text-brand-error">
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function AddItemForm({ groupId, onAdded }: { groupId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-[10px] px-2 py-2 text-xs font-semibold text-brand-primary-dark hover:bg-brand-primary/8"
      >
        <Plus className="size-3.5" />
        Add Item
      </button>
    );
  }

  const add = async () => {
    setBusy(true);
    setError(null);
    const result = await createMenuItem(groupId, label, href, icon);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setLabel("");
    setHref("");
    setIcon("Tag");
    setOpen(false);
    onAdded();
  };

  return (
    <div className="space-y-2 rounded-[10px] border border-dashed border-brand-border p-3">
      <IconSelect value={icon} onChange={setIcon} />
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (e.g. Salmon)"
        className="h-9 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
      />
      <input
        value={href}
        onChange={(e) => setHref(e.target.value)}
        placeholder="/link-path or #anchor"
        className="h-9 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
      />
      {error && <p className="text-xs text-brand-error">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={add}
          disabled={busy || !label.trim()}
          className="flex h-8 items-center gap-1 rounded-[8px] bg-brand-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          Add
        </button>
        <button type="button" onClick={() => setOpen(false)} className="flex h-8 items-center gap-1 rounded-[8px] border border-brand-border px-3 text-xs font-semibold text-brand-body">
          Cancel
        </button>
      </div>
    </div>
  );
}

function GroupCard({ group, onSaved }: { group: MenuGroup; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(group.title);
  const [icon, setIcon] = useState(group.icon);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Icon = MENU_ICON_OPTIONS[group.icon] ?? MENU_ICON_OPTIONS.Tag;

  const save = async () => {
    setBusy(true);
    setError(null);
    const result = await updateMenuGroup(group.id, title, icon);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setEditing(false);
    onSaved();
  };

  const remove = async () => {
    if (!confirm(`Delete the "${group.title}" group and all its items?`)) return;
    setBusy(true);
    await deleteMenuGroup(group.id);
    setBusy(false);
    onSaved();
  };

  const move = async (direction: "up" | "down") => {
    setBusy(true);
    await moveMenuGroup(group.id, direction);
    setBusy(false);
    onSaved();
  };

  return (
    <div className="rounded-[16px] border border-brand-border/60 bg-white p-4">
      {editing ? (
        <div className="mb-3 space-y-2 rounded-[10px] border border-brand-primary/40 bg-brand-primary/5 p-3">
          <IconSelect value={icon} onChange={setIcon} />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Group title"
            className="h-9 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
          />
          {error && <p className="text-xs text-brand-error">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={save} disabled={busy} className="flex h-8 items-center gap-1 rounded-[8px] bg-brand-primary px-3 text-xs font-semibold text-white disabled:opacity-60">
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} disabled={busy} className="flex h-8 items-center gap-1 rounded-[8px] border border-brand-border px-3 text-xs font-semibold text-brand-body">
              <X className="size-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-heading">
            <Icon className="size-4 text-brand-primary-dark" />
            {group.title}
          </p>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => move("up")} disabled={busy} className="rounded p-1.5 text-brand-light hover:text-brand-heading">
              <ChevronUp className="size-4" />
            </button>
            <button type="button" onClick={() => move("down")} disabled={busy} className="rounded p-1.5 text-brand-light hover:text-brand-heading">
              <ChevronDown className="size-4" />
            </button>
            <button type="button" onClick={() => setEditing(true)} disabled={busy} className="rounded p-1.5 text-brand-light hover:text-brand-primary-dark">
              <Pencil className="size-4" />
            </button>
            <button type="button" onClick={remove} disabled={busy} className="rounded p-1.5 text-brand-light hover:text-brand-error">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-0.5">
        {group.items.map((item) => (
          <ItemRow key={item.id} item={item} onSaved={onSaved} />
        ))}
      </div>
      <div className="mt-1.5">
        <AddItemForm groupId={group.id} onAdded={onSaved} />
      </div>
    </div>
  );
}

function AddGroupForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("LayoutGrid");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-dashed border-brand-border px-4 py-4 text-sm font-semibold text-brand-primary-dark transition-colors hover:bg-brand-primary/5"
      >
        <Plus className="size-4" />
        Add Group
      </button>
    );
  }

  const add = async () => {
    setBusy(true);
    setError(null);
    const result = await createMenuGroup(title, icon);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setTitle("");
    setIcon("LayoutGrid");
    setOpen(false);
    onAdded();
  };

  return (
    <div className="space-y-2 rounded-[16px] border border-brand-border/60 bg-white p-4">
      <IconSelect value={icon} onChange={setIcon} />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Group title (e.g. By Occasion)"
        className="h-10 w-full rounded-[8px] border border-brand-border bg-white px-2.5 text-sm focus:border-brand-primary focus:outline-none"
      />
      {error && <p className="text-xs text-brand-error">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={add} disabled={busy || !title.trim()} className="flex h-9 items-center gap-1.5 rounded-[8px] bg-brand-primary px-4 text-xs font-semibold text-white disabled:opacity-60">
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
          Add Group
        </button>
        <button type="button" onClick={() => setOpen(false)} className="flex h-9 items-center gap-1.5 rounded-[8px] border border-brand-border px-4 text-xs font-semibold text-brand-body">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function MenuManager({ groups }: { groups: MenuGroup[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className={cn("space-y-4")}>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onSaved={refresh} />
      ))}
      <AddGroupForm onAdded={refresh} />
    </div>
  );
}
