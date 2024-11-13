import { FC, useCallback, useMemo } from "react";
import { List, ListOrdered, Quote, Type } from "lucide-react";
import { CommonGroupProps, EditorIcon } from "../../types";
import ToolbarButton from "../common/toolbar-button";
import Group from "../common/group";

export type BlockType = "paragraph" | "blockquote" | "bulletList" | "orderedList";

export type BlockGroupIcons = Record<BlockType, EditorIcon>;

export type BlockGroupProps = CommonGroupProps<BlockType, BlockGroupIcons>;

const BlockGroup: FC<BlockGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "paragraph",
      Icon: (icons as BlockGroupIcons).paragraph || Type,
      onClick: () => editor?.chain().focus().setParagraph().run(),
      active: !!editor?.isActive("paragraph"),
    },
    {
      type: "blockquote",
      Icon: (icons as BlockGroupIcons).blockquote || Quote,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
      active: !!editor?.isActive("blockquote"),
    },
    {
      type: "bulletList",
      Icon: (icons as BlockGroupIcons).bulletList || List,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
      active: !!editor?.isActive("bulletList"),
    },
    {
      type: "orderedList",
      Icon: (icons as BlockGroupIcons).orderedList || ListOrdered,
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
