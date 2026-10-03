"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type MenuActionResult = { ok: true; id: string } | { ok: false; error: string };

function revalidateMenu() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function createMenuGroup(title: string, icon: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  if (!title.trim()) return { ok: false, error: "Group title is required." };

  const supabase = await createClient();
  const { count } = await supabase.from("header_menu_groups").select("id", { count: "exact", head: true });
  const { data, error } = await supabase
    .from("header_menu_groups")
    .insert({ title: title.trim(), icon, sort_order: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.code === "23505" ? "A group with that title already exists." : error?.message ?? "Could not create group." };
  }

  revalidateMenu();
  return { ok: true, id: data.id };
}

export async function updateMenuGroup(id: string, title: string, icon: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  if (!title.trim()) return { ok: false, error: "Group title is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("header_menu_groups").update({ title: title.trim(), icon }).eq("id", id);
  if (error) return { ok: false, error: error.code === "23505" ? "A group with that title already exists." : error.message };

  revalidateMenu();
  return { ok: true, id };
}

export async function deleteMenuGroup(id: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { error } = await supabase.from("header_menu_groups").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateMenu();
  return { ok: true, id };
}

export async function moveMenuGroup(id: string, direction: "up" | "down"): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { data: groups, error } = await supabase.from("header_menu_groups").select("id, sort_order").order("sort_order", { ascending: true });
  if (error || !groups) return { ok: false, error: error?.message ?? "Could not load groups." };

  const index = groups.findIndex((g) => g.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= groups.length) return { ok: true, id };

  const a = groups[index];
  const b = groups[swapIndex];
  await Promise.all([
    supabase.from("header_menu_groups").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("header_menu_groups").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidateMenu();
  return { ok: true, id };
}

export async function createMenuItem(groupId: string, label: string, href: string, icon: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  if (!label.trim()) return { ok: false, error: "Label is required." };
  if (!href.trim().startsWith("/")) return { ok: false, error: "Link must be a relative path starting with /." };

  const supabase = await createClient();
  const { count } = await supabase.from("header_menu_items").select("id", { count: "exact", head: true }).eq("group_id", groupId);
  const { data, error } = await supabase
    .from("header_menu_items")
    .insert({ group_id: groupId, label: label.trim(), href: href.trim(), icon, sort_order: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.code === "23505" ? "An item with that label already exists in this group." : error?.message ?? "Could not create item." };
  }

  revalidateMenu();
  return { ok: true, id: data.id };
}

export async function updateMenuItem(id: string, label: string, href: string, icon: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  if (!label.trim()) return { ok: false, error: "Label is required." };
  if (!href.trim().startsWith("/")) return { ok: false, error: "Link must be a relative path starting with /." };

  const supabase = await createClient();
  const { error } = await supabase.from("header_menu_items").update({ label: label.trim(), href: href.trim(), icon }).eq("id", id);
  if (error) return { ok: false, error: error.code === "23505" ? "An item with that label already exists in this group." : error.message };

  revalidateMenu();
  return { ok: true, id };
}

export async function deleteMenuItem(id: string): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();
  const { error } = await supabase.from("header_menu_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateMenu();
  return { ok: true, id };
}

export async function moveMenuItem(id: string, groupId: string, direction: "up" | "down"): Promise<MenuActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("header_menu_items")
    .select("id, sort_order")
    .eq("group_id", groupId)
    .order("sort_order", { ascending: true });
  if (error || !items) return { ok: false, error: error?.message ?? "Could not load items." };

  const index = items.findIndex((it) => it.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) return { ok: true, id };

  const a = items[index];
  const b = items[swapIndex];
  await Promise.all([
    supabase.from("header_menu_items").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("header_menu_items").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidateMenu();
  return { ok: true, id };
}
