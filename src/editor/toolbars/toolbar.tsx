import { ComponentType, FC, Fragment, useCallback } from "react";
import { CommonGroupProps, PropsWithEditor } from "../types";
import Divider from "./divider";

export interface ToolbarProps {
  group: ComponentType<CommonGroupProps<string>>[];
}

const Toolbar: FC<PropsWithEditor<ToolbarProps>> = (props) => {
  const { editor, group } = props;

  const isLast = useCallback((index: number) => index === group.length - 1, [group]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex items-center gap-1 px-2 border-b border-solid border-slate-600">
      {group.map((Item, index) => (
        <Fragment key={index}>
          <Item editor={editor} />
          {!isLast(index) && <Divider />}
        </Fragment>
      ))}
    </div>
  );
};

Toolbar.displayName = "@blogcode/editor/Toolbar";
export default Toolbar;
