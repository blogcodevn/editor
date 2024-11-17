import { FC, useCallback } from "react";
import { Level } from "@tiptap/extension-heading";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import { CommonGroupProps } from "@blogcode/editor/types";
import Group from "@blogcode/editor/toolbars/common/group";
import IconH1 from "@blogcode/editor/icons/icon-h1";
import IconH2 from "@blogcode/editor/icons/icon-h2";
import IconH3 from "@blogcode/editor/icons/icon-h3";
import IconH4 from "@blogcode/editor/icons/icon-h4";
import IconH5 from "@blogcode/editor/icons/icon-h5";
import IconH6 from "@blogcode/editor/icons/icon-h6";
import ToolbarButton from "@blogcode/editor/toolbars/common/toolbar-button";

export type HeadingType = `heading${1 | 2 | 3 | 4 | 5 | 6}`;

export type HeadingGroupIcons = Record<HeadingType, SvgIcon>;

export type HeadingGroupProps = CommonGroupProps<HeadingType, HeadingGroupIcons>;

const defaultIcons = [
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
];

const HeadingGroup: FC<HeadingGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const isIncluded = useCallback((type: HeadingType) => !exclude.includes(type), [exclude]);

  const handleClick = useCallback((level: Level) => () => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }, [editor]);

  const renderButton = useCallback(
    (type: HeadingType, Icon: SvgIcon) => {
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
