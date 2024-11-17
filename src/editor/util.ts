import { Editor } from "@tiptap/react";

const Util = {
  $anchor(editor: Editor) {
    return editor.view.state.selection.$anchor;
  },
  doc(editor: Editor) {
    return editor.view.state.doc;
  },
};

export default Util;
