import { FC, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { AlignCenter, Columns, LayoutTemplate, Rows, Settings2, Trash2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import FloatingItem from "./floating-item";

export interface TableFloatingProps {
  editor: Editor;
  updatePosition: () => void;
}

const TableFloating: FC<TableFloatingProps> = (props) => {
  const { editor, updatePosition } = props;
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (showOptions) {
      updatePosition();
    }
  }, [showOptions, updatePosition]);
  
  const tableAttributes = editor.getAttributes('table');

  const toggleFullWidth = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().updateAttributes('table', {
      isFullWidth: !tableAttributes.isFullWidth
    }).run();
  };

  const toggleCenter = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().updateAttributes('table', {
      alignment: tableAttributes.alignment === 'center' ? 'left' : 'center'
    }).run();
  };

  const addCaption = () => {
    const caption = window.prompt('Enter caption:', tableAttributes.caption || '');
    if (caption !== null) {  // Allow empty string to remove caption
      editor.chain().focus().updateAttributes('table', {
        caption: caption || null
      }).run();
    }
  };

  return (
    <Popover open={showOptions} onOpenChange={setShowOptions}>
      <PopoverTrigger asChild>
      <button
          type="button"
          onMouseDown={(e) => { 
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowOptions(prev => !prev);
          }}
          className={cn(
            "flex items-center justify-center",
            "w-6 h-6 rounded-full",
            "bg-primary text-primary-foreground shadow-md",
            "hover:bg-primary/90 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          )}
        >
          <Settings2 className="w-3 h-3" />
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" align="end" className="w-56 p-2">
        <div className="flex flex-col gap-1">
          {/* Layout Controls */}
          <div className="space-y-1">
            <FloatingItem
              onClick={toggleFullWidth}
              active={tableAttributes.isFullWidth}
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>{tableAttributes.isFullWidth ? 'Normal Width' : 'Full Width'}</span>
            </FloatingItem>

            <FloatingItem
              onClick={toggleCenter}
              active={tableAttributes.alignment === 'center'}
            >
              <AlignCenter className="w-4 h-4" />
              <span>{tableAttributes.alignment === 'center' ? 'Align Left' : 'Center'}</span>
            </FloatingItem>

            <FloatingItem
              onClick={addCaption}
              active={!!tableAttributes.caption}
            >
              <Type className="w-4 h-4" />
              <span>{tableAttributes.caption ? 'Edit Caption' : 'Add Caption'}</span>
            </FloatingItem>
          </div>

          <Separator className="my-2" />

          {/* Row Controls */}
          <div className="space-y-1">
            <div className="flex flex-col items-center gap-1">
              <FloatingItem
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="flex-1 w-full"
              >
                <Rows className="w-4 h-4" />
                <span>Add Row Above</span>
              </FloatingItem>

              <FloatingItem
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="flex-1"
              >
                <Rows className="w-4 h-4" />
                <span>Add Row Below</span>
              </FloatingItem>
            </div>

            <FloatingItem
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              <Rows className="w-4 h-4" />
              <span>Delete Row</span>
            </FloatingItem>
          </div>

          <Separator className="my-2" />

          {/* Column Controls */}
          <div className="space-y-1">
            <div className="flex flex-col items-center gap-1">
              <FloatingItem
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="flex-1"
              >
                <Columns className="w-4 h-4" />
                <span>Add Column Before</span>
              </FloatingItem>

              <FloatingItem
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="flex-1"
              >
                <Columns className="w-4 h-4" />
                <span>Add Column After</span>
              </FloatingItem>
            </div>

            <FloatingItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              <Columns className="w-4 h-4" />
              <span>Delete Column</span>
            </FloatingItem>
          </div>

          <Separator className="my-2" />

          {/* Delete Table */}
          <FloatingItem
            onClick={() => editor.chain().focus().deleteTable().run()}
            danger
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Table</span>
          </FloatingItem>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableFloating;
