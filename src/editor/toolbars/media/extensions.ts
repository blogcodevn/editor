import Image from '@tiptap/extension-image';

const MediaExtensions = [
  Image.configure({
    HTMLAttributes: {
      class: 'media-image'
    },
    allowBase64: true,
  }),
];

export default MediaExtensions;
