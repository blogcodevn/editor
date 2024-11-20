import TextAlign from "@tiptap/extension-text-align"

const AlignmentExtensions = [
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),
];

export default AlignmentExtensions;
