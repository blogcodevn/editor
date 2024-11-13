/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Pencil, Trash2 } from "lucide-react";

const ImageView: FC<NodeViewProps> = ({
  node,
  getPos,
  editor,
}) => {
  const handleEdit = () => {
    // TODO: Implement edit functionality
  };

  const handleDelete = () => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      editor
        .chain()
        .focus()
        .setNodeSelection(pos)
        .deleteSelection()
        .run();
    }
  };

  return (
    <NodeViewWrapper className="media-image-wrapper">
      <div className="media-controls">
        <button
          type="button"
          onClick={handleEdit}
          className="p-1.5 rounded bg-white/70 hover:bg-white/90 dark:bg-gray-700/70 dark:hover:bg-gray-600/90 
            backdrop-blur-sm border border-gray-200 dark:border-gray-600"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="p-1.5 rounded bg-white/70 hover:bg-white/90 dark:bg-gray-700/70 dark:hover:bg-gray-600/90
            backdrop-blur-sm border border-gray-200 dark:border-gray-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <img
        {...node.attrs}
        className="media-image"
      />
      {node.attrs.caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-1">
          {node.attrs.caption}
        </figcaption>
      )}
    </NodeViewWrapper>
  );
};

ImageView.displayName = "@blogcode/editor/ImageView";
export default ImageView;
