import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CommonGroupProps } from "@blogcode/editor/types";
import Group from "@blogcode/editor/toolbars/common/group";
import IconChevronDown from "@/editor/icons/icon-chevron-down";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];

const FONT_FAMILIES = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana"
];

export type FontType = "font-size" | "font-family";

const FontGroup: FC<CommonGroupProps<FontType>> = (props) => {
  const { exclude = [], editor } = props;
  const [ isOpenFamily, setIsOpenFamily ] = useState(false);
  const [ isOpenSize, setIsOpenSize ] = useState(false);

  const handleSelectFamily = (family: string) => () => {
    editor?.chain().focus().setFontFamily(family).run();
    setIsOpenFamily(false);
  };

  const handleSelectSize = (size: string) => () => {
    editor?.chain().focus().setFontSize(size).run();
    setIsOpenSize(false);
  };

  const currentFontFamily = editor?.getAttributes('fontFamily').fontFamily as string;
  const currentFontSize = editor?.getAttributes('fontSize').fontSize as string || '16px';

  return (
    <Group className="gap-0">
      {!exclude.includes("font-family") && (
        <Popover open={isOpenFamily} onOpenChange={setIsOpenFamily}>
          <PopoverTrigger asChild>
            <button type="button" className="w-28 flex items-center h-6 gap-2 rounded-sm border border-slate-600">
              <span className="flex-grow truncate">{currentFontFamily}</span>
              <span className="w-6 min-w-6 h-6 flex rounded-e-sm items-center justify-center">
                <IconChevronDown size={12} />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-auto max-w-max py-2 px-1">
            <div className="flex flex-col">
              {FONT_FAMILIES.map((family) => (
                <button
                  key={family}
                  type="button"
                  className={cn(
                    "w-full min-h-8 rounded-sm text-sm hover:bg-gray-300/30 px-2 whitespace-nowrap overflow-hidden text-left",
                    { "bg-gray-300/30": editor?.isActive({ fontFamily: family }) }
                  )}
                  onClick={handleSelectFamily(family)}
                  style={{ fontFamily: family }}
                >
                  {family}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
      {!exclude.includes("font-size") && (
        <Popover open={isOpenSize} onOpenChange={setIsOpenSize}>
        <PopoverTrigger asChild>
          <button type="button" className="w-16 flex items-center h-6 rounded-sm border border-slate-600">
            <span className="flex-grow truncate text-xs pl-1">{currentFontSize}</span>
            <span className="w-6 min-w-6 h-6 flex rounded-e-sm items-center justify-center">
              <IconChevronDown size={12} />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-auto max-w-max py-2 px-1">
          <div className="flex flex-col space-y-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={cn(
                  "w-full min-h-8 h-auto rounded-sm text-sm hover:bg-gray-300/30 px-2 py-1 whitespace-nowrap",
                  "overflow-hidden text-right",
                  { "bg-gray-300/30": editor?.isActive({ fontSize: size }) }
                )}
                onClick={handleSelectSize(size)}
                style={{ fontSize: size }}
              >
                {size}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      )}
    </Group>
  );
};

FontGroup.displayName = "@blogcode/editor/FontGroup";
export default FontGroup;
