import { FC, useState } from "react";
import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconColumns from "@blogcode/editor/icons/icon-columns";
import IconColumnRemove from "@blogcode/editor/icons/icon-column-remove";
import IconColumnInsertRight from "@blogcode/editor/icons/icon-column-insert-right";
import IconColumnInsertLeft from "@blogcode/editor/icons/icon-column-insert-left";
import { withCollapse } from "./with-collapse";

export interface ColumnsProps {
  editor: Editor;
}

const ColumnsButton: FC<ColumnsProps> = (props) => {
  const { editor } = props;

  const [isOpen, setIsOpen] = useState(false);

  const addColumnLeft = () => editor.chain().focus().addColumnBefore().run();
  const addColumnRight = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FAB
          title="Columns"
          color="info"
          icon={IconColumns}
        />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-40 p-1">
        <div className="flex justify-center items-center gap-1 mx-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={addColumnLeft}
              >
                <IconColumnInsertLeft className="w-4 h-4 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs">Add column left</p>
            </TooltipContent>
          </Tooltip>
          <div className="inline-flex items-center justify-center text-xs text-slate-500 mx-1">|</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={addColumnRight}
              >
                <IconColumnInsertRight className="w-4 h-4 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs">Add column right</p>
            </TooltipContent>
          </Tooltip>
          <div className="inline-flex items-center justify-center text-xs text-slate-500 mx-1">|</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center px-2 py-1 rounded backdrop-blur-md bg-slate-500/20 shadow-sm"
                onClick={deleteColumn}
              >
                <IconColumnRemove className="w-4 h-4 text-red-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="bg-gray-800 backdrop-blur-md border-gray-700">
              <p className="text-xs text-red-500">Delete column</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Columns = withCollapse(ColumnsButton);
Columns.displayName = "@blogcode/editor/table/Columns";
export default Columns;