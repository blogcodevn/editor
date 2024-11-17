import { FC } from "react";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconEnterRow from "@blogcode/editor/icons/icon-enter-row";
import { withCollapse } from "./with-collapse";

export interface NewLineProps {
  wrapper: HTMLDivElement;
}

const NewLineButton: FC<NewLineProps> = (props) => {
  const { wrapper } = props;

  const handleAddPlaceholder = () => {
    if (wrapper?.parentElement) {
      const placeholder = document.createElement("p");
      const br = document.createElement("br");

      br.classList.add("ProseMirror-trailingBreak");
      placeholder.append(br);

      wrapper.insertAdjacentElement("afterend", placeholder);
    }
  }

  return (
    <FAB
      title="Insert new line"
      color="success"
      icon={IconEnterRow as any}
      onClick={handleAddPlaceholder}
    />
  );
};

const NewLine = withCollapse(NewLineButton);
NewLine.displayName = "@blogcode/editor/table/NewLine";
export default NewLine;
