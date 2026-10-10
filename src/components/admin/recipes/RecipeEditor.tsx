"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import {
  Save,
  Loader2,
  ImagePlus,
  X,
  AlertCircle,
  CloudCheck,
  CloudOff,
  ImageIcon,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { createEditorExtensions } from "@/lib/tiptap/extensions";
import Toolbar from "@/components/admin/posts/editor/Toolbar";
import SelectionMenu from "@/components/admin/posts/editor/SelectionMenu";
import SeoPanel, { type SeoState } from "@/components/admin/posts/editor/SeoPanel";
import MediaPicker from "@/components/admin/media/MediaPicker";
import Switch from "@/components/ui/Switch";
import { createRecipe, updateRecipe, type RecipeInput } from "@/lib/recipes/mutations";
import { slugify, type Recipe, type RecipePage, type RecipeStatus } from "@/lib/recipes/types";
import { sanitizeTiptapJson, type TiptapNode } from "@/lib/tiptap/inline-text";
import { uploadImage, type MediaItem } from "@/lib/media/upload";

const statusOptions: { value: RecipeStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

const AUTOSAVE_INTERVAL_MS = 5000; // 5 s — fast enough that a page refresh won't lose recent edits

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function numberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function RecipeEditor({
  recipe,
  page,
}: {
  recipe?: Recipe;
  page: RecipePage;
}) {
  const router = useRouter();
  const isEditing = !!recipe;

  const [currentId, setCurrentId] = useState<string | null>(recipe?.id ?? null);
  const savedStatusRef = useRef<RecipeStatus>(recipe?.status ?? "draft");

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [slug, setSlug] = useState(recipe?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(recipe?.description ?? "");

  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(recipe?.image || null);
  const [heroImageAlt, setHeroImageAlt] = useState(recipe?.imageAlt && recipe?.imageAlt !== recipe?.title ? recipe.imageAlt : "");
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);

  const [prepTime, setPrepTime] = useState(recipe?.prepTimeMinutes?.toString() ?? "");
  const [cookTime, setCookTime] = useState(recipe?.cookTimeMinutes?.toString() ?? "");
  const [totalTime, setTotalTime] = useState(recipe?.totalTimeMinutes?.toString() ?? "");
  const [servings, setServings] = useState(recipe?.servings?.toString() ?? "");
  const [servingsLabel, setServingsLabel] = useState(recipe?.servingsLabel ?? "");

  const calories = recipe?.calories?.toString() ?? "";
  const protein = recipe?.proteinGrams?.toString() ?? "";
  const carbs = recipe?.carbsGrams?.toString() ?? "";
  const fat = recipe?.fatGrams?.toString() ?? "";

  const [tag, setTag] = useState(recipe?.tag ?? "");
  const rating = recipe?.rating ?? null;

  const [status, setStatus] = useState<RecipeStatus>(recipe?.status ?? "draft");
  const [showAiShare, setShowAiShare] = useState(recipe?.showAiShare ?? true);
  const [seo, setSeo] = useState<SeoState>({
    seoTitle: recipe?.seo.title ?? "",
    seoDescription: recipe?.seo.description ?? "",
    canonicalUrl: recipe?.seo.canonical ?? "",
    focusKeyword: recipe?.seo.focusKeyword ?? "",
    ogImage: recipe?.seo.ogImage ?? "",
    noindex: recipe?.seo.noindex ?? false,
    nofollow: recipe?.seo.nofollow ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, forceTick] = useState(0);

  // A ref so Toolbar/SelectionMenu can request an immediate autosave (e.g.
  // right after inserting an image) without causing re-renders.
  const pendingAutosaveRef = useRef(false);
  const autosaveInProgressRef = useRef(false);
  const currentIdRef = useRef<string | null>(currentId);
  useEffect(() => { currentIdRef.current = currentId; }, [currentId]);

  // Always-up-to-date ref to the editor instance so async callbacks
  // (paste/drop upload) can access it without stale closures.
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  // Always points at the latest runAutosave. The autosave timers below read
  // through this ref instead of depending on runAutosave directly — otherwise
  // every keystroke (which changes buildInput → runAutosave's identity) would
  // tear down and recreate the debounce/interval effects, clearing their
  // pending timers and canceling an in-flight autosave. That race is exactly
  // why freshly-inserted images never made it to the DB: the save scheduled
  // right after an image insert was cleared by the next unrelated re-render.
  const runAutosaveRef = useRef<() => Promise<void>>(() => Promise.resolve());

  /** Upload a raw File to Supabase and insert it into the editor as a
   * persistent image node, then persist it immediately so a quick refresh or
   * navigation can't lose it. */
  const uploadAndInsertImage = useCallback(async (file: File): Promise<boolean> => {
    const ed = editorRef.current;
    if (!ed || !file.type.startsWith("image/")) return false;
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadImage(fd);
    if (!result.ok) return false;
    ed.chain().focus().setImage({ src: result.item.url, alt: result.item.altText ?? "" }).run();
    // Save right now — don't rely on the debounce surviving the re-renders that
    // the insert (and any follow-up alt-text edit) triggers.
    await runAutosaveRef.current();
    return true;
  }, []);

  // Fresh extension instances for THIS editor only (never shared) — see
  // createEditorExtensions() for why sharing breaks image attributes.
  const extensions = useMemo(() => createEditorExtensions(), []);

  const editor = useEditor({
    extensions,
    content: sanitizeTiptapJson((recipe?.contentJson as TiptapNode) ?? { type: "doc", content: [{ type: "paragraph" }] }) as JSONContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[420px] px-6 py-5 focus:outline-none",
      },
      // Intercept clipboard pastes that contain a raw image file and upload
      // them to Supabase so we always store a real URL, never a blob: URL.
      handlePaste(_view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((i) => i.kind === "file" && i.type.startsWith("image/"));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        
        // Use a temporary loading toast if we had one, for now just fire it off.
        const toastId = Math.random().toString(36).substring(7);
        setAutosaveStatus("saving"); // Double as an upload indicator
        uploadAndInsertImage(file).finally(() => setAutosaveStatus("saved"));
        return true;
      },
      // Intercept drag-and-drop image files and upload them too.
      handleDrop(_view, event, _slice, moved) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith("image/"));
        if (!imageFile) return false;
        event.preventDefault();
        
        setAutosaveStatus("saving"); // Double as an upload indicator
        uploadAndInsertImage(imageFile).finally(() => setAutosaveStatus("saved"));
        return true;
      },
    },
  });

  // Keep editorRef in sync so async upload callbacks always have latest editor.
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Tracks the currently-selected image node so its Alt Text / Title fields
  // can be edited from a sidebar panel, WordPress-block-style.
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

  const bodyText = editor?.getText() ?? "";
  const wordCount = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;

  const hasAltText = (() => {
    if (!editor) return Boolean(heroImageAlt.trim() || title.trim());
    let imageCount = 0;
    let missing = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === "image") {
        imageCount += 1;
        if (!node.attrs.alt) missing += 1;
      }
    });
    return (imageCount === 0 || missing === 0) && Boolean(heroImageAlt.trim() || title.trim());
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
    (statusOverride: RecipeStatus): RecipeInput | null => {
      if (!editor) return null;
      const finalSlug = slugify(slug || title);
      if (!title.trim() || !finalSlug) return null;

      const prep = numberOrNull(prepTime);
      const cook = numberOrNull(cookTime);
      const totalManual = numberOrNull(totalTime);

      return {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim(),
        heroImageUrl,
        heroImageAlt: heroImageAlt.trim() || null,
        pageId: page.id,
        sectionIds: recipe?.sectionIds ?? [],
        prepTimeMinutes: prep,
        cookTimeMinutes: cook,
        totalTimeMinutes: totalManual ?? (prep != null || cook != null ? (prep ?? 0) + (cook ?? 0) : null),
        servings: numberOrNull(servings),
        servingsLabel: servingsLabel.trim() || null,
        // Deep-clone to a plain object. Passed straight from editor.getJSON(),
        // the image node's `attrs` gets encoded as a React Flight reference
        // ("$T") across the Server Action boundary and arrives empty on the
        // server — which dropped every inserted image's src. A JSON round-trip
        // forces plain, fully-serializable data.
        content: JSON.parse(JSON.stringify(editor.getJSON())) as TiptapNode,
        calories: numberOrNull(calories),
        proteinGrams: numberOrNull(protein),
        carbsGrams: numberOrNull(carbs),
        fatGrams: numberOrNull(fat),
        tag: tag.trim() || null,
        rating,
        status: statusOverride,
        seoTitle: seo.seoTitle || null,
        seoDescription: seo.seoDescription || null,
        seoOgImageUrl: seo.ogImage || null,
        canonicalUrl: seo.canonicalUrl || null,
        focusKeyword: seo.focusKeyword || null,
        seoNoindex: seo.noindex,
        seoNofollow: seo.nofollow,
        showAiShare,
      };
    },
    [
      editor,
      title,
      slug,
      description,
      heroImageUrl,
      heroImageAlt,
      page.id,
      recipe,
      prepTime,
      cookTime,
      totalTime,
      servings,
      servingsLabel,
      calories,
      protein,
      carbs,
      fat,
      tag,
      rating,
      seo,
      showAiShare,
    ]
  );

  // Core autosave helper — called both by the interval and by immediate
  // triggers (e.g. right after an image is inserted into the editor).
  const runAutosave = useCallback(async () => {
    if (autosaveInProgressRef.current) return;
    if (!title.trim()) return;
    const input = buildInput(savedStatusRef.current);
    if (!input) return;

    autosaveInProgressRef.current = true;
    setAutosaveStatus("saving");
    const result = currentIdRef.current
      ? await updateRecipe(currentIdRef.current, input)
      : await createRecipe(input);
    autosaveInProgressRef.current = false;

    if (!result.ok) {
      setAutosaveStatus("error");
      return;
    }
    if (!currentIdRef.current) {
      currentIdRef.current = result.id;
      setCurrentId(result.id);
    }
    setAutosaveStatus("saved");
    setLastSavedAt(new Date());
    pendingAutosaveRef.current = false;
  }, [title, buildInput]);

  // Keep the ref pointing at the latest runAutosave so the timers below can
  // call it without listing it as a dependency (which would reset them on
  // every render — see runAutosaveRef's declaration).
  useEffect(() => {
    runAutosaveRef.current = runAutosave;
  }, [runAutosave]);

  // Silent background autosave — never changes the recipe's live/published
  // status, only persists content so nothing is lost if the browser closes.
  // Deps are empty so the interval is created once and never torn down by
  // unrelated re-renders; it always calls the newest runAutosave via the ref.
  useEffect(() => {
    const interval = setInterval(() => {
      runAutosaveRef.current();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Debounced immediate save — fires ~1.5 s after any editor change so that
  // inserted images (and other edits) are persisted well before a page refresh.
  // Depends only on `editor` (stable for the editor's lifetime), so a pending
  // debounce is never cleared just because another field changed.
  useEffect(() => {
    if (!editor) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleUpdate = () => {
      pendingAutosaveRef.current = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (pendingAutosaveRef.current) runAutosaveRef.current();
      }, 1500);
    };
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [editor]);

  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("A short intro/description is required.");

    const input = buildInput(status);
    if (!input) return setError("Slug is required.");

    setSaving(true);
    const result = currentId ? await updateRecipe(currentId, input) : await createRecipe(input);
    setSaving(false);

    if (!result.ok) return setError(result.error);

    savedStatusRef.current = status;
    router.push(`/admin/recipes/${page.slug}`);
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
          placeholder="Recipe title"
          className="w-full rounded-[14px] border border-brand-border bg-white px-4 py-3.5 font-display text-2xl text-brand-heading placeholder:text-brand-light/60 focus:border-brand-primary focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-brand-border/70 bg-white px-4 py-2.5 text-sm">
          <span className="shrink-0 text-brand-light">themealprepideas.com/recipes/</span>
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short intro — shown under the title, on the recipe card, and used as the default meta description…"
          rows={2}
          className="w-full resize-none rounded-[12px] border border-brand-border/70 bg-white px-4 py-3 text-sm text-brand-body placeholder:text-brand-light focus:border-brand-primary focus:outline-none"
        />

        <div>
          <p className="mb-2 text-xs text-brand-light">
            Write the full recipe here — Ingredients, Instructions, Storage Tips, Notes, Nutrition, Dietary, FAQs — using
            headings (H2/H3), bold, and bullet/numbered lists, exactly like a blog post.
          </p>
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

      {/* Sidebar — sticky with its own scroll so it never drags the whole
          page along with a tall editor/SEO panel. */}
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
            onChange={(e) => setStatus(e.target.value as RecipeStatus)}
            className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving…" : currentId ? "Update Recipe" : "Save Recipe"}
          </button>
          <p className="mt-2 text-center text-[11px] text-brand-light">
            Your work is autosaved automatically as you type.
          </p>
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Photo</p>
          {heroImageUrl ? (
            <div className="relative mb-3 h-36 w-full overflow-hidden rounded-[12px]">
              <Image src={heroImageUrl} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setHeroImageUrl(null)}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-brand-heading"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setHeroPickerOpen(true)}
              className="mb-3 flex h-36 w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-brand-border text-brand-light transition-colors hover:border-brand-primary/50 hover:text-brand-primary-dark"
            >
              <ImagePlus className="size-5" />
              <span className="text-xs font-medium">Choose from Media Library</span>
            </button>
          )}
          <MediaPicker
            open={heroPickerOpen}
            onClose={() => setHeroPickerOpen(false)}
            onSelect={(item: MediaItem) => {
              setHeroImageUrl(item.url);
              if (item.altText) setHeroImageAlt(item.altText);
            }}
          />
          {heroImageUrl && (
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Alt Text (for SEO)</label>
              <input
                type="text"
                value={heroImageAlt}
                onChange={(e) => setHeroImageAlt(e.target.value)}
                placeholder={title || "Describe this photo…"}
                className="h-9 w-full rounded-[8px] border border-brand-border px-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
              {!heroImageAlt && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-brand-orange-deep">
                  <AlertTriangle className="size-3" />
                  Falls back to the recipe title if left blank.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Time &amp; Servings</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Prep (min)</label>
              <input
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Cook (min)</label>
              <input
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Total (min)</label>
              <input
                type="number"
                min={0}
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                placeholder="auto"
                className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-light">Servings</label>
              <input
                type="number"
                min={0}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>
          <label className="mb-1 mt-3 block text-xs font-medium text-brand-light">Servings Label</label>
          <input
            type="text"
            value={servingsLabel}
            onChange={(e) => setServingsLabel(e.target.value)}
            placeholder="e.g. Makes 12 muffins"
            className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          />
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-brand-heading">Card Details</p>
          <label className="mb-1 block text-xs font-medium text-brand-light">Tag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. High Protein"
            className="h-10 w-full rounded-[10px] border border-brand-border bg-white px-3 text-sm focus:border-brand-primary focus:outline-none"
          />
          {recipe && recipe.ratingCount > 0 && (
            <p className="mt-3 text-[11px] text-brand-light">
              Rated {recipe.rating?.toFixed(1)} from {recipe.ratingCount} visitor{recipe.ratingCount === 1 ? "" : "s"} — this comes from real ratings on the recipe card, not something you set here.
            </p>
          )}
        </div>

        <div className="rounded-[18px] border border-brand-border/60 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-heading">
                <Sparkles className="size-4 text-brand-primary-dark" />
                AI Discovery
              </p>
              <p className="mt-1.5 pr-2 text-xs leading-relaxed text-brand-light">
                Shows a &ldquo;Summarize with AI&rdquo; card near the top of this recipe, with one-click links to
                ChatGPT, Perplexity &amp; Claude — pre-filled to ask them to summarize it and cite this site.
              </p>
            </div>
            <Switch checked={showAiShare} onChange={setShowAiShare} label="Show Summarize with AI section" />
          </div>
        </div>

        <SeoPanel
          seo={seo}
          onChange={setSeo}
          title={title}
          excerpt={description}
          bodyText={bodyText}
          wordCount={wordCount}
          hasAltText={hasAltText}
          hasLinks={hasLinks}
          slug={slug}
          basePath="recipes"
        />
      </div>
    </div>
  );
}
