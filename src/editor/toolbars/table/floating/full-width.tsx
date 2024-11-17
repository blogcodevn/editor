import { FC, MouseEvent } from "react";
import { Editor } from "@tiptap/react";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconFullWidth from "@blogcode/editor/icons/icon-full-width";
import { withCollapse } from "./with-collapse";

export interface FullWidthProps {
  editor: Editor;
}

const FullWidthButton: FC<FullWidthProps> = (props) => {
  const { editor } = props;
  const value = editor.getAttributes('table').isFullWidth;

  const toggleFullWidth = (e: MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().updateAttributes('table', { isFullWidth: !value }).run();
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
