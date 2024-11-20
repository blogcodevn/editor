import { FC } from "react";
import { withCollapse } from "./with-collapse";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconEnterRow from "@blogcode/editor/icons/icon-enter-row";

export interface NewLineProps {
  table: HTMLTableElement;
}

const NewLineButton: FC<NewLineProps> = (props) => {
  const { table } = props;

  const handleAddPlaceholder = () => {
    if (table?.parentElement) {
      const placeholder = document.createElement("p");
      const br = document.createElement("br");

      br.classList.add("ProseMirror-trailingBreak");
      placeholder.append(br);

      table.insertAdjacentElement("afterend", placeholder);
    }
  }

  return (
    <FAB
      title="Insert new line"
      color="success"
      icon={IconEnterRow}
      onClick={handleAddPlaceholder}
    />
  );
};

const NewLine = withCollapse(NewLineButton);
NewLine.displayName = "@blogcode/editor/table/NewLine";
export default NewLine;
