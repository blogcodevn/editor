import { FC, useCallback } from "react";
import { Level } from "@tiptap/extension-heading";
import { CommonGroupProps, EditorIcon } from "../../types";
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react";
import Group from "../common/group";
import ToolbarButton from "../common/toolbar-button";

export type HeadingType = `heading${1 | 2 | 3 | 4 | 5 | 6}`;

export type HeadingGroupIcons = Record<HeadingType, EditorIcon>;

export type HeadingGroupProps = CommonGroupProps<HeadingType, HeadingGroupIcons>;

const defaultIcons = [
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
];

const HeadingGroup: FC<HeadingGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const isIncluded = useCallback((type: HeadingType) => !exclude.includes(type), [exclude]);

  const handleClick = useCallback((level: Level) => () => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }, [editor]);

  const renderButton = useCallback(
    (type: HeadingType, Icon: EditorIcon) => {
      if (!isIncluded(type)) {
        return null;
      }

      const [, level ] = type.match(/^heading(\d)$/) || [];

      return (
        <ToolbarButton
          key={type}
          Icon={Icon}
          onClick={handleClick(+level as Level)}
          active={!!editor?.isActive("heading", { level })}
          className={btnClassName}
        />
      );
    },
    [isIncluded, handleClick, editor, btnClassName]
  );

  const iconsArray = [
    (icons as HeadingGroupIcons).heading1,
    (icons as HeadingGroupIcons).heading2,
    (icons as HeadingGroupIcons).heading3,
    (icons as HeadingGroupIcons).heading4,
    (icons as HeadingGroupIcons).heading5,
    (icons as HeadingGroupIcons).heading6,
  ];

  return (
    <Group className={className}>
      {new Array(6).fill(null).map((_, index) => (
        renderButton(
          `heading${index + 1}` as HeadingType,
          iconsArray[index] || defaultIcons[index]
        )
      ))}
    </Group>
  );
};

HeadingGroup.displayName = "@blogcode/editor/HeadingGroup";
export default HeadingGroup;
