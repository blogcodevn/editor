import { Extension } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const IndentExtension = Extension.create({
  name: "indent",
  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        const { $from, $to } = state.selection;
        const range = $from.blockRange($to);

        if (!range) {
          return false;
        }

        const pos = range.start;
        const node = state.doc.nodeAt(pos);

        if (!node) {
          return false;
        }

        const currentIndent = node.attrs.indent || 0;
        const transaction = tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          indent: Math.min(currentIndent + 1, 8), // 8 is the maximum indent level
        });

        dispatch?.(transaction);
        return true;
      },
      outdent: () => ({ state, dispatch }) => {
        if (!dispatch) {
          return false;
        }

        const { $from, $to } = state.selection;
        const range = $from.blockRange($to);

        if (!range) {
          return false;
        }

        const pos = range.start;
        const node = state.doc.nodeAt(pos);

        if (!node) {
          return false;
        }

        const currentIndent = node.attrs.indent || 0;
        const transaction = state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          indent: Math.max(currentIndent - 1, 0),
        });

        dispatch(transaction);
        return true;
      },
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["heading", "paragraph"],
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => {
              if (attributes.indent === 0) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.indent * 2}em`,
              };
            },
          },
        },
      },
    ];
  }
});

const IndentExtensions = [IndentExtension];
export default IndentExtensions;
