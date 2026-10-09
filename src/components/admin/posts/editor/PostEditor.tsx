"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import { Save, Loader2, ImagePlus, X, AlertCircle, Settings2, CloudCheck, CloudOff, ImageIcon, AlertTriangle } from "lucide-react";
import { createEditorExtensions } from "@/lib/tiptap/extensions";
import Toolbar from "@/components/admin/posts/editor/Toolbar";
import SelectionMenu from "@/components/admin/posts/editor/SelectionMenu";
import SeoPanel, { type SeoState } from "@/components/admin/posts/editor/SeoPanel";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { createPost, updatePost, type PostInput } from "@/lib/posts/mutations";
import { slugify } from "@/lib/posts/types";
import type { BlogPost, Category, PostStatus } from "@/lib/posts/types";
import { sanitizeTiptapJson, type TiptapNode } from "@/lib/tiptap/inline-text";
import { uploadImage, type MediaItem } from "@/lib/media/upload";

const statusOptions: { value: PostStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

const AUTOSAVE_INTERVAL_MS = 5000; // 5 s fallback; debounced save fires in 1.5 s after any edit

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function PostEditor({ post, categories }: { post?: BlogPost; categories: Category[] }) {
  const router = useRouter();
  const isEditing = !!post;

  const [currentId, setCurrentId] = useState<string | null>(post?.id ?? null);
  const savedStatusRef = useRef<PostStatus>(post?.status ?? "draft");

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.image || null);
  const [coverImageAlt, setCoverImageAlt] = useState(post?.imageAlt && post?.imageAlt !== post?.title ? post.imageAlt : "");
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(post?.categoryId ?? categories[0]?.id ?? null);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [scheduledFor, setScheduledFor] = useState<string>("");
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [trending, setTrending] = useState(post?.trending ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [seo, setSeo] = useState<SeoState>({
    seoTitle: post?.seo.title ?? "",
    seoDescription: post?.seo.description ?? "",
    canonicalUrl: post?.seo.canonical ?? "",
    focusKeyword: post?.seo.focusKeyword ?? "",
    ogImage: post?.seo.ogImage ?? "",
    noindex: post?.seo.noindex ?? false,
    nofollow: post?.seo.nofollow ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, forceTick] = useState(0);

  // Always-up-to-date ref to the editor instance so async upload callbacks
  // (paste/drop) can access it without stale closures.
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const pendingAutosaveRef = useRef(false);
  const autosaveInProgressRef = useRef(false);
  const currentIdRef = useRef<string | null>(post?.id ?? null);
  useEffect(() => { currentIdRef.current = currentId; }, [currentId]);

  // Always points at the latest runAutosave so the autosave timers can call it
  // without depending on its identity — otherwise every keystroke would reset
  // the debounce/interval and could cancel a save scheduled right after an
  // image insert (which is why inserted images were never persisted).
  const runAutosaveRef = useRef<() => Promise<void>>(() => Promise.resolve());

  /** Upload a raw File to Supabase and insert into the editor as a
   * persistent image node (never a blob: URL), then persist immediately. */
  const uploadAndInsertImage = useCallback(async (file: File): Promise<boolean> => {
    const ed = editorRef.current;
    if (!ed || !file.type.startsWith("image/")) return false;
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadImage(fd);
    if (!result.ok) return false;
    ed.chain().focus().setImage({ src: result.item.url, alt: result.item.altText ?? "" }).run();
    await runAutosaveRef.current();
    return true;
  }, []);

  const extensions = useMemo(() => createEditorExtensions(), []);

  const editor = useEditor({
    extensions,
    content: sanitizeTiptapJson((post?.contentJson as TiptapNode) ?? { type: "doc", content: [{ type: "paragraph" }] }) as JSONContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[420px] px-6 py-5 focus:outline-none",
      },
      handlePaste(_view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.kind === "file" && i.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        setAutosaveStatus("saving");
        uploadAndInsertImage(file).finally(() => setAutosaveStatus("saved"));
        return true;
      },
      handleDrop(_view, event, _slice, moved) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith("image/"));
        if (!imageFile) return false;
        event.preventDefault();
        setAutosaveStatus("saving");
        uploadAndInsertImage(imageFile).finally(() => setAutosaveStatus("saved"));
        return true;
      },
    },
  });

  // Keep editorRef in sync.
  useEffect(() => { editorRef.current = editor; }, [editor]);

  // Tracks the currently-selected image node in the editor so its Alt Text /
  // Title fields can be edited from a sidebar panel, WordPress-block-style.
  const [selectedImage, setSelectedImage] = useState<{ alt: string; title: string; src: string } | null>(null);

  useEffect(() => {
    if (!editor) return;
    const syncSelection = () => {
      const { selection } = editor.state;
      if (selection instanceof NodeSelection && selection.node.type.name === "image") {
        const attrs = selection.node.attrs as { src: string; alt?: string; title?: string };
        setSelectedImage({ src: attrs.src, alt: attrs.alt ?? "", title: attrs.title ?? "" });
      } else {
        setSelectedImage(null);
      }
    };
    editor.on("selectionUpdate", syncSelection);
    editor.on("transaction", syncSelection);
    return () => {
      editor.off("selectionUpdate", syncSelection);
      editor.off("transaction", syncSelection);
    };
  }, [editor]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const bodyText = editor?.getText() ?? "";
  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;

  const hasAltText = (() => {
    if (!editor) return false;
    let imageCount = 0;
    let missing = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === "image") {
        imageCount += 1;
        if (!node.attrs.alt) missing += 1;
      }
    });
    return imageCount > 0 && missing === 0;
  })();

  const hasLinks = (() => {
    if (!editor) return false;
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.marks?.some((m) => m.type.name === "link")) found = true;
    });
    return found;
  })();

  const buildInput = useCallback(
    (statusOverride: PostStatus): PostInput | null => {
      if (!editor) return null;
      const finalSlug = slugify(slug || title);
      if (!title.trim() || !finalSlug) return null;

      const words = editor.getText().trim();
      const minutes = Math.max(1, Math.round((words ? words.split(/\s+/).length : 0) / 200));

      return {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        coverImageUrl,
        coverImageAlt: coverImageAlt.trim() || null,
        categoryId,
        status: statusOverride,
        scheduledFor: statusOverride === "scheduled" && scheduledFor ? new Date(scheduledFor).toISOString() : null,
        tags,
        trending,
        featured,
        content: editor.getJSON() as TiptapNode,
        minutes,
        seoTitle: seo.seoTitle || null,
        seoDescription: seo.seoDescription || null,
        seoOgImageUrl: seo.ogImage || null,
        canonicalUrl: seo.canonicalUrl || null,
        focusKeyword: seo.focusKeyword || null,
        seoNoindex: seo.noindex,
        seoNofollow: seo.nofollow,
      };
    },
    [editor, title, slug, excerpt, coverImageUrl, coverImageAlt, categoryId, scheduledFor, tags, trending, featured, seo]
  );

  // Core autosave — shared by the interval and the debounced editor listener.
  const runAutosave = useCallback(async () => {
    if (autosaveInProgressRef.current) return;
    if (!title.trim()) return;
    const input = buildInput(savedStatusRef.current);
    if (!input) return;
    autosaveInProgressRef.current = true;
    setAutosaveStatus("saving");
    const result = currentIdRef.current
      ? await updatePost(currentIdRef.current, input)
      : await createPost(input);
    autosaveInProgressRef.current = false;
    if (!result.ok) { setAutosaveStatus("error"); return; }
    if (!currentIdRef.current) { currentIdRef.current = result.id; setCurrentId(result.id); }
    setAutosaveStatus("saved");
    setLastSavedAt(new Date());
    pendingAutosaveRef.current = false;
  }, [title, buildInput]);

  // Keep the ref current so the timers call the latest runAutosave by reference.
  useEffect(() => {
    runAutosaveRef.current = runAutosave;
  }, [runAutosave]);

  // Fallback interval autosave. Empty deps so it is never torn down by unrelated
  // re-renders; it always invokes the newest runAutosave through the ref.
  useEffect(() => {
    const interval = setInterval(() => { runAutosaveRef.current(); }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Debounced save fires 1.5 s after any editor change (catches image inserts).
  // Depends only on `editor` so an unrelated field change can't clear a pending
  // save.
  useEffect(() => {
    if (!editor) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onUpdate = () => {
      pendingAutosaveRef.current = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { if (pendingAutosaveRef.current) runAutosaveRef.current(); }, 1500);
    };
    editor.on("update", onUpdate);
    return () => { editor.off("update", onUpdate); if (timer) clearTimeout(timer); };
  }, [editor]);

  // Tick the "Saved Xs ago" label forward every few seconds.
  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (status === "scheduled" && !scheduledFor) return setError("Pick a date/time to schedule this post.");

    const input = buildInput(status);
    if (!input) return setError("Slug is required.");

    setSaving(true);
    const result = currentId ? await updatePost(currentId, input) : await createPost(input);
    setSaving(false);

    if (!result.ok) return setError(result.error);

    savedStatusRef.current = status;
    router.push("/admin/posts");
    router.refresh();
  };

  if (!editor) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      {/* Main column */}
      <div className="min-w-0 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          className="w-full rounded-[14px] border border-brand-border bg-white px-4 py-3.5 font-display text-2xl text-brand-heading placeholder:text-brand-light/60 focus:border-brand-primary focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-brand-border/70 bg-white px-4 py-2.5 text-sm">
          <span className="shrink-0 text-brand-light">themealprepideas.com/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="min-w-0 flex-1 bg-transparent text-brand-heading focus:outline-none"
          />
        </div>

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt — shown on the blog index and used as the default meta description…"
          rows={2}
          className="w-full resize-none rounded-[12px] border border-brand-border/70 bg-white px-4 py-3 text-sm text-brand-body placeholder:text-brand-light focus:border-brand-primary focus:outline-none"
        />

        <div>
          <Toolbar editor={editor} />
          <div className="overflow-x-auto rounded-b-[16px] border border-brand-border/60 bg-white">
            <SelectionMenu editor={editor} />
            <EditorContent editor={editor} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-light">
            <span>{wordCount} words</span>
            <span className="flex items-center gap-1.5">
              {autosaveStatus === "saving" && (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Saving…
                </>
              )}
              {autosaveStatus === "saved" && lastSavedAt && (
                <>
                  <CloudCheck className="size-3.5 text-brand-primary" /> Saved {timeAgo(lastSavedAt)}
                </>
              )}
              {autosaveStatus === "error" && (
                <>
                  <CloudOff className="size-3.5 text-brand-error" /> Autosave failed — click Save
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar — sticky with its own scroll on large screens so it never
          drags the whole page along with a tall editor/SEO panel. */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
        {selectedImage && editor && (
          <div className="rounded-[18px] border-2 border-brand-primary/40 bg-white p-5">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
              <ImageIcon className="size-4 text-brand-primary-dark" />
              Image Settings
            </p>
            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-[10px] bg-brand-gray">
              <Image src={selectedImage.src} alt="" fill className="object-cover" />
            </div>

            <label className="mb-1 block text-xs font-medium text-brand-light">Alt Text (required for SEO)</label>
            <input
              type="text"
              value={selectedImage.alt}
              onChange={(e) => {
                editor.commands.updateAttributes("image", { alt: e.target.value });
                setSelectedImage((prev) => (prev ? { ...prev, alt: e.target.value } : prev));
              }}
              placeholder="Describe what's in this image…"
              className="mb-3 h-9 w-full rounded-[8px] border border-brand-border px-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
            {!selectedImage.alt && (
              <p className="-mt-2 mb-3 flex items-center gap-1 text-[11px] text-brand-orange-deep">
                <AlertTriangle className="size-3" />
                Missing alt text hurts both SEO and accessibility.
              </p>
            )}

            <label className="mb-1 block text-xs font-medium text-brand-light">Title Attribute</label>
            <input
              type="text"
              value={selectedImage.title}
              onChange={(e) => {
                editor.commands.updateAttributes("image", { title: e.target.value });
                setSelectedImage((prev) => (prev ? { ...prev, title: e.target.value } : prev));
              }}
              placeholder="Shown as a tooltip on hover"
              className="h-9 w-full rounded-[8px] border border-brand-border px-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
            <p className="mt-2 text-[11px] text-brand-light">Caption can be added directly under the image in the editor.</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-[12px] bg-brand-error/10 px-4 py-3 text-sm text-brand-error">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Publish</p>

          <label className="mb-1 block text-xs font-medium text-brand-light">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {status === "scheduled" && (
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="mt-3 h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
            />
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : currentId ? "Update Post" : "Save Post"}
          </button>
          <p className="mt-2 text-center text-[11px] text-brand-light">
            Your work is autosaved automatically as you type.
          </p>

          <div className="mt-4 space-y-2 border-t border-brand-border/60 pt-4">
            <label className="flex items-center gap-2 text-sm text-brand-body">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 accent-brand-primary" />
              Featured on blog home
            </label>
            <label className="flex items-center gap-2 text-sm text-brand-body">
              <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} className="size-4 accent-brand-primary" />
              Mark as trending
            </label>
          </div>
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Cover Image</p>
          {coverImageUrl ? (
            <div className="relative mb-3 h-36 w-full overflow-hidden rounded-[12px]">
              <Image src={coverImageUrl} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverImageUrl(null)}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-brand-heading"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCoverPickerOpen(true)}
              className="mb-3 flex h-36 w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
            >
              <ImagePlus className="size-5" />
              <span className="text-xs font-medium">Choose from Media Library</span>
            </button>
          )}
          <MediaPicker
            open={coverPickerOpen}
            onClose={() => setCoverPickerOpen(false)}
            onSelect={(item: MediaItem) => {
              setCoverImageUrl(item.url);
              if (item.altText) setCoverImageAlt(item.altText);
            }}
          />
          {coverImageUrl && (
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Alt Text (for SEO)</label>
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder={title || "Describe this image…"}
                className="h-9 w-full rounded-[8px] border border-brand-border px-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
              {!coverImageAlt && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-brand-orange-deep">
                  <AlertTriangle className="size-3" />
                  Falls back to the post title if left blank.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-heading">Category</p>
            <Link href="/admin/categories" className="flex items-center gap-1 text-xs font-medium text-brand-primary-dark hover:underline">
              <Settings2 className="size-3.5" />
              Manage
            </Link>
          </div>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-medium text-brand-primary-dark">
                {t}
                <button type="button" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            placeholder="Add a tag, press Enter"
            className="mt-2 h-9 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>

        <SeoPanel
          seo={seo}
          onChange={setSeo}
          title={title}
          excerpt={excerpt}
          bodyText={bodyText}
          wordCount={wordCount}
          hasAltText={hasAltText}
          hasLinks={hasLinks}
          slug={slug}
        />
      </div>
    </div>
  );
}
