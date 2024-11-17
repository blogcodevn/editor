import { FC, useState } from "react";
import { Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconRows from "@blogcode/editor/icons/icon-rows";
import IconRowInsertAbove from "@blogcode/editor/icons/icon-insert-row-above";
import IconRowInsertBellow from "@blogcode/editor/icons/icon-row-insert-bellow";
import IconRowRemove from "@blogcode/editor/icons/icon-row-remove";
import { withCollapse } from "./with-collapse";

export interface RowsProps {
  editor: Editor;
}

const RowsButton: FC<RowsProps> = (props) => {
  const { editor } = props;

  const [isOpen, setIsOpen] = useState(false);

  const addRowAbove = () => editor.chain().focus().addRowBefore().run();
  const addRowBellow = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FAB
          title="Rows"
          color="info"
          icon={IconRows}
        />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-40 p-1">
        <div className="flex justify-center items-center gap-1 mx-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={addRowAbove}
              >
                <IconRowInsertAbove className="w-4 h-4 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs">Add row above</p>
            </TooltipContent>
          </Tooltip>
          <div className="inline-flex items-center justify-center text-xs text-slate-500 mx-1">|</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={addRowBellow}
              >
                <IconRowInsertBellow className="w-4 h-4 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs">Add row bellow</p>
            </TooltipContent>
          </Tooltip>
          <div className="inline-flex items-center justify-center text-xs text-slate-500 mx-1">|</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={deleteRow}
              >
                <IconRowRemove className="w-4 h-4 text-red-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs text-red-500">Delete row</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Rows = withCollapse(RowsButton);
Rows.displayName = "@blogcode/editor/table/Rows";
export default Rows;
