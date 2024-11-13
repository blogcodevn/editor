import { FC } from "react";
import { Editor } from "@tiptap/react";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import Divider from "../divider";

export interface ImageFloatingProps {
  editor: Editor;
  updatePosition(): void;
  getPos(): number;
  onSync?(): Promise<void>;
  showSync?: boolean;
}

const ImageFloating: FC<ImageFloatingProps> = (props) => {
  const {
    editor,
    getPos,
    showSync,
    onSync,
  } = props;

  const handleEdit = () => {
    const pos = getPos();
    const node = editor.state.doc.nodeAt(pos);
    
    if (node && node.type.name === 'image') {
      const styleString = node.attrs.style || '';
      const styles = styleString.split(';').reduce((acc: Record<string, string>, style: string) => {
        const [key, value] = style.split(':').map(s => s.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {});
  
      const imageExtension = editor.extensionManager.extensions.find(ext => ext.name === 'image');
      const handleImageEdit = imageExtension?.options?.handleImageEdit;
      
      if (handleImageEdit) {
        handleImageEdit({
          image: node.attrs.src,
          alt: node.attrs.alt,
          caption: node.attrs.caption || node.attrs.title, // Lấy caption từ node attrs hoặc fallback về title
          width: styles.width,
          height: styles.height,
          objectFit: styles['object-fit'] as string,
        });
      }
    }
  };

  const handleDelete = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .setNodeSelection(pos)
      .deleteSelection()
      .run();
  };

  return (
    <div className="flex items-center backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-md">
      <button
        type="button"
        onClick={handleEdit}
        className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <Divider className="mx-0.5" />
      <button
        type="button"
        onClick={handleDelete}
        className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {showSync && (
        <>
          <Divider className="mx-0.5" />
          <button
            type="button"
            onClick={onSync}
            className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageFloating;