"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, FolderKanban } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/categories/mutations";
import type { Category } from "@/lib/posts/types";

function CategoryRow({ category, onUpdated, onDeleted }: { category: Category; onUpdated: (c: Category) => void; onDeleted: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!name.trim() || name.trim() === category.name) {
      setEditing(false);
      setName(category.name);
      return;
    }
    setSaving(true);
    const result = await updateCategory(category.id, name);
    setSaving(false);
    if (!result.ok) return setError(result.error);
    onUpdated({ ...category, name: name.trim() });
    setEditing(false);
  };

  const remove = async () => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    setDeleting(true);
    const result = await deleteCategory(category.id);
    setDeleting(false);
    if (!result.ok) return setError(result.error);
    onDeleted(category.id);
  };

  return (
    <div className="flex items-center gap-3 border-b border-brand-border/40 px-5 py-3.5 last:border-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary-dark">
        <FolderKanban className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="h-9 w-full max-w-xs rounded-[8px] border border-brand-border px-2.5 text-sm focus:border-brand-primary focus:outline-none"
          />
        ) : (
          <p className="truncate font-medium text-brand-heading">{category.name}</p>
        )}
        {error && <p className="mt-1 text-xs text-brand-error">{error}</p>}
      </div>

      <span className="shrink-0 text-xs text-brand-light">{category.postCount ?? 0} posts</span>

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <button type="button" onClick={save} disabled={saving} className="flex size-8 items-center justify-center rounded-lg text-brand-primary-dark hover:bg-brand-primary/8">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(category.name);
              }}
              className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-gray"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setEditing(true)} className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-gray hover:text-brand-heading">
              <Pencil className="size-4" />
            </button>
            <button type="button" onClick={remove} disabled={deleting} className="flex size-8 items-center justify-center rounded-lg text-brand-light hover:bg-brand-error/10 hover:text-brand-error">
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoryList({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    if (!newName.trim()) return;
    setAdding(true);
    const result = await createCategory(newName);
    setAdding(false);
    if (!result.ok) return setError(result.error);
    setCategories((prev) => [...prev, { id: result.id, name: newName.trim(), slug: newName.trim(), postCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 rounded-[16px] border border-brand-border/60 bg-white p-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New category name…"
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-brand-border px-3 text-sm focus:border-brand-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
        >
          {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add
        </button>
      </div>
      {error && <p className="mb-4 text-sm text-brand-error">{error}</p>}

      <div className="overflow-hidden rounded-[16px] border border-brand-border/60 bg-white">
        {categories.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-light">No categories yet — add your first one above.</p>
        ) : (
          categories.map((c) => (
            <CategoryRow
              key={c.id}
              category={c}
              onUpdated={(updated) => setCategories((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
              onDeleted={(id) => setCategories((prev) => prev.filter((p) => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
}
