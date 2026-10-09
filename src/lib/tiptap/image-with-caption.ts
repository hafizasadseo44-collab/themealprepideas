import { Image } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "@/components/admin/posts/editor/ImageNodeView";

/**
 * Extends Tiptap's built-in Image with a `caption` attribute (rendered as a
 * <figcaption> on the public site) and a React NodeView.
 *
 * IMPORTANT: the attributes are declared EXPLICITLY rather than spreading
 * `...this.parent?.()`. In the minified production build the parent-method
 * lookup was failing, so `addAttributes()` returned no attributes at all — the
 * image node then had no `src`, serialized as a bare `{ "type": "image" }`, and
 * every inserted image was dropped on save/reload. Declaring src/alt/title here
 * guarantees they are always registered.
 */
export const ImageWithCaption = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      height: { default: null },
      caption: {
        default: null as string | null,
        parseHTML: (element) =>
          element.querySelector?.("figcaption")?.textContent ?? element.getAttribute?.("data-caption") ?? null,
        renderHTML: (attributes) => ({ "data-caption": (attributes.caption as string) ?? undefined }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
