import type { Metadata } from "next";
import { getMediaLibrary } from "@/lib/media/queries";
import MediaGrid from "@/components/admin/media/MediaGrid";

export const metadata: Metadata = {
  title: "Media Library | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const items = await getMediaLibrary();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-heading">Media Library</h1>
          <p className="mt-1 text-sm text-brand-light">
            {items.length} {items.length === 1 ? "file" : "files"} · Click any image to preview or copy its URL
          </p>
        </div>
      </div>

      <div className="mt-6">
        <MediaGrid items={items} />
      </div>
    </div>
  );
}
