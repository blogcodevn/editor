import { FC } from "react";
import { Editor } from "@tiptap/react";
import { handleMouse } from "./handler";
import { withCollapse } from "./with-collapse";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconRemove from "@blogcode/editor/icons/icon-remove";

export interface RemoveProps {
  editor: Editor;
}

const RemoveButton: FC<RemoveProps> = (props) => {
  const { editor } = props;
  const removeTable = handleMouse(() => editor.chain().focus().deleteTable().run());

  return (
    <FAB
      title="Remove table"
      color="danger"
      icon={IconRemove}
      onClick={handleMouse(removeTable)}
    />
  );
};

const Remove = withCollapse(RemoveButton);
Remove.displayName = "@blogcode/editor/table/Remove";
export default Remove;
