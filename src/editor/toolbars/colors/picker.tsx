import { ChangeEvent, FC, useState } from "react";
import { EditorIcon, PropsWithEditor } from "../../types";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ToolbarButton from "../common/toolbar-button";

export type PickerType = "textStyle" | "highlight";

export interface PickerProps {
  Icon: EditorIcon;
  type: PickerType;
  className?: string;
}

const Picker: FC<PropsWithEditor<PickerProps>> = (props) => {
  const { editor, Icon, type, className } = props;
  const [ isOpen, setIsOpen ] = useState(false);
  const currentColor = editor?.getAttributes(type).color || "#000000";

  const handleReset = () => {
    editor?.chain().focus().unsetColor().run();
    setIsOpen(false);
  };

  const updateColor = (e: string | ChangeEvent<HTMLInputElement>) => {
    const color = typeof e === "string" ? e : e.target.value;

    if (type === "textStyle") {
      editor?.chain().focus().setColor(color).run();
    } else {
      editor?.chain().focus().toggleHighlight({ color }).run();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton Icon={Icon} active={!!editor?.isActive(type)} className={cn("relative", className)}>
          <div 
            className="w-2 h-2 rounded-full absolute bottom-1 right-1 border border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: currentColor }}
          />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex flex-col gap-2">
          <HexColorPicker
            color={currentColor} 
            onChange={updateColor}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={currentColor}
              onChange={updateColor}
              className={cn(
                "flex h-8 w-24 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm",
                "transition-colors dark:border-gray-800 dark:bg-gray-950"
              )}
            />
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Reset
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

Picker.displayName = "@blogcode/editor/Picker";
export default Picker;
