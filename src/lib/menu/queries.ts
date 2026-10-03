import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { MenuGroup } from "@/lib/menu/types";

/** Public: the header's "Browse Categories" mega-menu, groups with their items in order. */
export async function getHeaderMenu(): Promise<MenuGroup[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("header_menu_groups")
    .select("id, title, icon, sort_order, header_menu_items ( id, label, href, icon, sort_order )")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    if (error) console.error("[getHeaderMenu]", error.message);
    return [];
  }

  type Row = {
    id: string;
    title: string;
    icon: string;
    sort_order: number;
    header_menu_items: { id: string; label: string; href: string; icon: string; sort_order: number }[];
  };

  return (data as unknown as Row[]).map((row) => ({
    id: row.id,
    title: row.title,
    icon: row.icon,
    sortOrder: row.sort_order,
    items: [...row.header_menu_items]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: item.id,
        groupId: row.id,
        label: item.label,
        href: item.href,
        icon: item.icon,
        sortOrder: item.sort_order,
      })),
  }));
}
