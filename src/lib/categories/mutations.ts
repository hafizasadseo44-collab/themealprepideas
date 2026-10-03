"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { slugify } from "@/lib/posts/types";
import { notifyNewCategory } from "@/lib/email/notify";

export type CategoryActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function createCategory(name: string): Promise<CategoryActionResult> {
  await requireRole(["admin"]);
  if (!name.trim()) return { ok: false, error: "Category name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug: slugify(name) })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.code === "23505" ? "A category with that name already exists." : error?.message ?? "Could not create category." };

  revalidatePath("/admin/categories");
  revalidatePath("/blog");

  notifyNewCategory({ name: name.trim() }).catch((err) => console.error("[email] notifyNewCategory failed:", err));

  return { ok: true, id: data.id };
}

export async function updateCategory(id: string, name: string): Promise<CategoryActionResult> {
  await requireRole(["admin"]);
  if (!name.trim()) return { ok: false, error: "Category name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ name: name.trim(), slug: slugify(name) }).eq("id", id);

  if (error) return { ok: false, error: error.code === "23505" ? "A category with that name already exists." : error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { ok: true, id };
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    const message = error.code === "23503" ? "Can't delete — posts are still assigned to this category." : error.message;
    return { ok: false, error: message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  return { ok: true, id };
}
