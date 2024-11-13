import { FC, useCallback, useMemo } from "react";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { CommonGroupProps, EditorIcon } from "../../types";
import Group from "../common/group";
import ToolbarButton from "../common/toolbar-button";

export type BasicType = "bold" | "italic" | "underline" | "strike";

export interface BasicGroupIcons {
  bold?: EditorIcon;
  italic?: EditorIcon;
  underline?: EditorIcon;
  strike?: EditorIcon;
}

export type BasicGroupProps = CommonGroupProps<BasicType>;

const BasicGroup: FC<BasicGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "bold",
      Icon: icons?.bold || Bold,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: !!editor?.isActive("bold"),
    },
    {
      type: "italic",
      Icon: icons?.italic || Italic,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: !!editor?.isActive("italic"),
    },
    {
      type: "underline",
      Icon: icons?.underline || Underline,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: !!editor?.isActive("underline"),
    },
    {
      type: "strike",
      Icon: icons?.strike || Strikethrough,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      active: !!editor?.isActive("strike"),
    }
  ] as const, [icons, editor]);

  const isIncluded = useCallback((type: BasicType) => !exclude.includes(type), [exclude]);

  const renderButton = useCallback(
    (item: typeof items[number]) => {
      if (!isIncluded(item.type)) {
        return null;
      }

      return (
        <ToolbarButton
          key={item.type}
          Icon={item.Icon}
          onClick={item.onClick}
          active={item.active}
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

BasicGroup.displayName = "@blogcode/editor/BasicGroup";
export default BasicGroup;
