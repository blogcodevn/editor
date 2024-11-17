import { ChangeEvent, FC, useState } from "react";
import { Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { handleMouse } from "./handler";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import FAB from "@blogcode/editor/toolbars/common/fab";
import Segment from "@blogcode/editor/toolbars/common/segment";
import IconAlignLeft from "@blogcode/editor/icons/icon-align-left";
import IconAlignRight from "@blogcode/editor/icons/icon-align-right";
import IconAlignCenter from "@blogcode/editor/icons/icon-align-center";
import { withCollapse } from "./with-collapse";

export interface AlignmentProps {
  editor: Editor;
}

const icons: Record<string, SvgIcon> = {
  left: IconAlignLeft,
  center: IconAlignCenter,
  right: IconAlignRight,
};

const AlignmentButton: FC<AlignmentProps> = (props) => {
  const { editor } = props;
  const [isOpen, setIsOpen] = useState(false);
  const value = editor.getAttributes('table').alignment;

  const showAlign = () => setIsOpen((prev) => !prev);

  const handleChangeAlignment = handleMouse((e: ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().updateAttributes("table", { alignment: e.target.value }).run();
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FAB
          title="Alignment"
          color="info"
          icon={icons[value || "left"]}
          onMouseDown={handleMouse()}
          onClick={handleMouse(showAlign)}
        />
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-28 p-2">
        <Segment
          onMouseDown={handleMouse()}
          onClick={handleMouse()}
          value={value}
          onChange={handleChangeAlignment}
          options={[
            { value: "left", label: <AlignLeft size={12} strokeWidth={1} /> },
            { value: "center", label: <AlignCenter size={12} strokeWidth={1} /> },
            { value: "right", label: <AlignRight size={12} strokeWidth={1} /> },
          ]}
        />
      </PopoverContent>
    </Popover>
  );
};

const Alignment = withCollapse(AlignmentButton);
Alignment.displayName = "@blogcode/editor/table/Alignment";
export default Alignment;
