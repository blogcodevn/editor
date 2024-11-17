import { FC, useCallback, useMemo } from "react";
import { CommonGroupProps } from "@blogcode/editor/types";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import Group from "@blogcode/editor/toolbars/common/group";
import ToolbarButton from "@blogcode/editor/toolbars/common/toolbar-button";
import IconParagraph from "@blogcode/editor/icons/icon-paragraph";
import IconBlockquote from "@blogcode/editor/icons/icon-blockquote";
import IconListBullet from "@blogcode/editor/icons/icon-list-bullet";
import IconListOrdered from "@blogcode/editor/icons/icon-list-ordered";

export type BlockType = "paragraph" | "blockquote" | "bulletList" | "orderedList";

export type BlockGroupIcons = Record<BlockType, SvgIcon>;

export type BlockGroupProps = CommonGroupProps<BlockType, BlockGroupIcons>;

const BlockGroup: FC<BlockGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "paragraph",
      Icon: (icons as BlockGroupIcons).paragraph || IconParagraph,
      onClick: () => editor?.chain().focus().setParagraph().run(),
      active: !!editor?.isActive("paragraph"),
    },
    {
      type: "blockquote",
      Icon: (icons as BlockGroupIcons).blockquote || IconBlockquote,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      active: !!editor?.isActive("blockquote"),
    },
    {
      type: "bulletList",
      Icon: (icons as BlockGroupIcons).bulletList || IconListBullet,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: !!editor?.isActive("bulletList"),
    },
    {
      type: "orderedList",
      Icon: (icons as BlockGroupIcons).orderedList || IconListOrdered,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
      active: !!editor?.isActive("orderedList"),
    }
  ] as const, [icons, editor]);

  const isIncluded = useCallback((type: BlockType) => !exclude.includes(type), [exclude]);

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

BlockGroup.displayName = "@blogcode/editor/BlockGroup";
export default BlockGroup;
