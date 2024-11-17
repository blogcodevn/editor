import { ChangeEvent, FC } from 'react';
import { CommonGroupProps } from '@blogcode/editor/types';
import Group from '@blogcode/editor/toolbars/common/group';
import Segment from '../common/segment';
import IconAlignLeft from '@/editor/icons/icon-align-left';
import IconAlignCenter from '@/editor/icons/icon-align-center';
import IconAlignRight from '@/editor/icons/icon-align-right';
import IconAlignJustify from '@/editor/icons/icon-align-justify';

export type AlignmentType = "left" | "center" | "right" | "justify";

const AlignmentGroup: FC<CommonGroupProps<AlignmentType>> = ({ editor }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    editor?.chain().focus().setTextAlign(e.target.value).run();
  };
  return (
    <Group>
      <Segment
        value={"left"}
        onChange={handleChange}
        options={[
          { value: "left", label: <IconAlignLeft size={12} strokeWidth={1} /> },
          { value: "center", label: <IconAlignCenter size={12} strokeWidth={1} /> },
          { value: "right", label: <IconAlignRight size={12} strokeWidth={1} /> },
          { value: "justify", label: <IconAlignJustify size={12} strokeWidth={1} /> },
        ]}
        className="bg-transparent"
      />
    </Group>
  );
};

AlignmentGroup.displayName = "@blogcode/edito/AlignmentGroup";
export default AlignmentGroup;
