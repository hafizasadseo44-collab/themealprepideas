import { Blockquote } from "@tiptap/extension-blockquote";

/** Adds an optional `attribution` attr to the standard blockquote node so
 * editors can attach a "— Name" line, matching the `quote` ContentBlock type. */
export const BlockquoteWithAttribution = Blockquote.extend({
  addAttributes() {
    return {
      attribution: {
        default: null as string | null,
        parseHTML: (element) => element.getAttribute("data-attribution"),
        renderHTML: (attributes) => {
          if (!attributes.attribution) return {};
          return { "data-attribution": attributes.attribution };
        },
      },
    };
  },
});
