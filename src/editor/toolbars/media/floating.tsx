import { FC, MouseEvent } from "react";
import { Editor } from "@tiptap/react";
import { Pencil, Trash } from "lucide-react";
import { ImageFormValue } from "../common/image-form";

export interface MediaFloatingProps {
  editor: Editor;
  getPos(): number; 
  updateAttributes(attrs: Partial<ImageFormValue>): void;
  deleteNode(): void;
}

const MediaFloating: FC<MediaFloatingProps> = (props) => {
  const { deleteNode } = props;

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: Implement edit dialog
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteNode();
  };

  return (
    <div className="absolute right-0 top-0 flex gap-1 p-1">
      <button 
        type="button"
        onClick={handleEdit}
        className="p-1 rounded bg-white/70 hover:bg-white/90 dark:bg-gray-700/70 dark:hover:bg-gray-600/90 
          backdrop-blur-sm border border-gray-200 dark:border-gray-600"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button" 
        onClick={handleDelete}
        className="p-1 rounded bg-white/70 hover:bg-white/90 dark:bg-gray-700/70 dark:hover:bg-gray-600/90
          backdrop-blur-sm border border-gray-200 dark:border-gray-600"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
};

MediaFloating.displayName = "@blogcode/editor/MediaFloating";
export default MediaFloating;
