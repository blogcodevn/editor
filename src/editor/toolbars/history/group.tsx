import { FC, useCallback, useMemo } from "react";
import { CommonGroupProps, EditorIcon } from "../../types";
import { Redo, Undo } from "lucide-react";
import ToolbarButton from "../common/toolbar-button";
import Group from "../common/group";

export type HistoryType = "undo" | "redo";

export type HistoryGroupIcons = Record<HistoryType, EditorIcon>;

export type HeadingGroupProps = CommonGroupProps<HistoryType, HistoryGroupIcons>;

const HistoryGroup: FC<HeadingGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "undo",
      Icon: (icons as HistoryGroupIcons).undo || Undo,
      onClick: () => editor?.chain().focus().undo().run(),
      active: false,
    },
    {
      type: "redo",
      Icon: (icons as HistoryGroupIcons).redo || Redo,
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
