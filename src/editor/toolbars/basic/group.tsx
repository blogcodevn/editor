import { FC, useCallback, useMemo } from "react";
import { CommonGroupProps } from "@blogcode/editor/types";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import Group from "@blogcode/editor/toolbars/common/group";
import IconBold from "@blogcode/editor/icons/icon-bold";
import IconItalic from "@blogcode/editor/icons/icon-italic";
import IconStrike from "@blogcode/editor/icons/icon-strike";
import IconUnderline from "@blogcode/editor/icons/icon-underline";
import ToolbarButton from "@blogcode/editor/toolbars/common/toolbar-button";

export type BasicType = "bold" | "italic" | "underline" | "strike";

export interface BasicGroupIcons {
  bold?: SvgIcon;
  italic?: SvgIcon;
  underline?: SvgIcon;
  strike?: SvgIcon;
}

export type BasicGroupProps = CommonGroupProps<BasicType>;

const BasicGroup: FC<BasicGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "bold",
      Icon: icons?.bold || IconBold,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      active: !!editor?.isActive("bold"),
    },
    {
      type: "italic",
      Icon: icons?.italic || IconItalic,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      active: !!editor?.isActive("italic"),
    },
    {
      type: "underline",
      Icon: icons?.underline || IconUnderline,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      active: !!editor?.isActive("underline"),
    },
    {
      type: "strike",
      Icon: icons?.strike || IconStrike,
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
