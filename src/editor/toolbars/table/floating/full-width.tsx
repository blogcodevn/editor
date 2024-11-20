import { FC, MouseEvent } from "react";
import { Editor } from "@tiptap/react";
import { withCollapse } from "./with-collapse";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconFullWidth from "@blogcode/editor/icons/icon-full-width";

export interface FullWidthProps {
  editor: Editor;
  table: HTMLTableElement;
}

const FullWidthButton: FC<FullWidthProps> = (props) => {
  const { editor, table } = props;

  const toggleFullWidth = (e: MouseEvent) => {
    e.preventDefault();

    const pos = editor.view.posAtDOM(table, 0);
    if (pos < 0) return null;

    const node = editor.state.doc.resolve(pos).node();
    if (!node) return;

    editor
      .chain()
      .focus()
      .setNodeSelection(pos)
      .updateAttributes("table", { isFullWidth: !node.attrs.isFullWidth })
      .run();
  };

  return (
    <FAB
      title="Toggle full width"
      color="info"
      icon={IconFullWidth}
      onClick={toggleFullWidth}
    />
  );
};

const FullWidth = withCollapse(FullWidthButton);
FullWidth.displayName = "@blogcode/editor/table/FullWidth";
export default FullWidth;
