import { FC } from 'react';
import { CommonGroupProps } from '@blogcode/editor/types';
import ToolbarButton from '@blogcode/editor/toolbars/common/toolbar-button';
import Group from '@blogcode/editor/toolbars/common/group';
import IconIndent from '@blogcode/editor/icons/icon-indent';
import IconOutdent from '@/editor/icons/icon-outdent';

export type IndentType = "indent" | "outdent";

const IndentGroup: FC<CommonGroupProps<IndentType>> = (props) => {
  const { editor } = props;
  const currentIndent = editor?.getAttributes("paragraph")?.indent || 0;

  return (
    <Group>
      <ToolbarButton
        Icon={IconIndent}
        onClick={() => editor?.chain().focus().indent().run()}
        active={currentIndent < 8}
      />
      <ToolbarButton
        Icon={IconOutdent}
        onClick={() => editor?.chain().focus().outdent().run()}
        active={currentIndent > 0}
      />
    </Group>
  );
};

IndentGroup.displayName = "@blogcode/editor/IndentGroup";
export default IndentGroup;
