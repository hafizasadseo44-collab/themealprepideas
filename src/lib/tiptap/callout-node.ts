import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalloutNodeView from "@/components/admin/posts/editor/CalloutNodeView";

export type CalloutVariant = "tip" | "warning" | "info";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    calloutNode: {
      insertCallout: (attrs?: { variant?: CalloutVariant }) => ReturnType;
    };
  }
}

export const CalloutNode = Node.create({
  name: "calloutNode",
  group: "block",
  atom: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      variant: { default: "tip" as CalloutVariant },
      title: { default: null as string | null },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout-node]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-callout-node": "" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      insertCallout:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { variant: attrs?.variant ?? "tip", title: null, text: "" },
          });
        },
    };
  },
});
