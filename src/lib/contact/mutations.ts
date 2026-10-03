"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

export type ContactActionResult = { ok: true } | { ok: false; error: string };

export async function markMessageRead(id: string): Promise<ContactActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ContactActionResult> {
  await requireRole(["admin", "editor"]);
  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/messages");
  return { ok: true };
}
