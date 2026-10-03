import { Image } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "@/components/admin/posts/editor/ImageNodeView";

/** Extends Tiptap's built-in Image with a `caption` attribute (rendered as a
 * <figcaption> on the public site) and a NodeView that shows the caption
 * inline plus a missing-alt-text warning, matching WordPress's image block. */
export const ImageWithCaption = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null as string | null,
        parseHTML: (element) => element.querySelector("figcaption")?.textContent ?? null,
        renderHTML: (attributes) => ({ "data-caption": attributes.caption ?? undefined }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
