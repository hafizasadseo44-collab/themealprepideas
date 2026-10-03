import type { Metadata } from "next";
import { getMediaLibrary } from "@/lib/media/queries";
import MediaGrid from "@/components/admin/media/MediaGrid";

export const metadata: Metadata = {
  title: "Media | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const items = await getMediaLibrary();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl text-brand-heading">Media Library</h1>
      <p className="mt-1 text-sm text-brand-light">{items.length} files</p>

      <div className="mt-6">
        <MediaGrid items={items} />
      </div>
    </div>
  );
}
