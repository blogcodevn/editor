import { Extension, Mark, mergeAttributes } from '@tiptap/core';

interface FontFamilyAttributes {
  fontFamily: string | null;
 }
 
 interface FontSizeAttributes {
  fontSize: string | null;
 }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (fontFamily: string) => ReturnType;
    };
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
    };
  }
}

export const FontFamily = Mark.create({
  name: 'fontFamily',

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontFamily?.replace(/["']/g, ''),
        renderHTML: (attributes: FontFamilyAttributes) => {
          if (!attributes.fontFamily) return {};
          return {
            style: `font-family: ${attributes.fontFamily}`
          };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        style: 'font-family',
      },
    ]
  },

  renderHTML({ mark, HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ chain }) => {
        return chain().setMark('fontFamily', { fontFamily }).run();
      }
    };
  }
});

export const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize,
        renderHTML: (attributes: FontSizeAttributes) => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}`
          };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ mark, HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('fontSize', { fontSize }).run();
      }
    };
  }
});

const FontExtensions = [
  FontFamily,
  FontSize
];

export default FontExtensions;
