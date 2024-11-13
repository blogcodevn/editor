import { Image as TiptapImage } from "@tiptap/extension-image";

const Image = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style
          };
        },
      },
      caption: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {};
          }
          return {
            'data-caption': attributes.caption
          };
        },
      }
    };
  },
});

export default Image;
