import { FC, useCallback, useMemo } from "react";
import { CommonGroupProps } from "@blogcode/editor/types";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import ToolbarButton from "@blogcode/editor/toolbars/common/toolbar-button";
import Group from "@blogcode/editor/toolbars/common/group";
import IconUndo from "@blogcode/editor/icons/icon-undo";
import IconRedo from "@blogcode/editor/icons/icon-redo";

export type HistoryType = "undo" | "redo";

export type HistoryGroupIcons = Record<HistoryType, SvgIcon>;

export type HeadingGroupProps = CommonGroupProps<HistoryType, HistoryGroupIcons>;

const HistoryGroup: FC<HeadingGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "undo",
      Icon: (icons as HistoryGroupIcons).undo || IconUndo,
      onClick: () => editor?.chain().focus().undo().run(),
      active: false,
    },
    {
      type: "redo",
      Icon: (icons as HistoryGroupIcons).redo || IconRedo,
      onClick: () => editor?.chain().focus().redo().run(),
      active: false,
    }
  ] as const, [icons, editor]);

  const isIncluded = useCallback((type: HistoryType) => !exclude.includes(type), [exclude]);

  const renderButton = useCallback(
    (item: typeof items[number]) => {
      if (!isIncluded(item.type)) {
        return null;
      }
      return (
        <ToolbarButton
          key={item.type}
          Icon={item.Icon}
          active={item.active}
          onClick={item.onClick}
          className={btnClassName}
        />
      );
    },
    [isIncluded, btnClassName]
  );

  return (
    <Group className={className}>
      {items.map(renderButton)}
    </Group>
  );
};

HistoryGroup.displayName = "@blogcode/editor/HistoryGroup";
export default HistoryGroup;
