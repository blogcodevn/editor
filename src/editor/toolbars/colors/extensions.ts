import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

const ColorsExtensions = [
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
];

export default ColorsExtensions;
