// src/editor/toolbars/media/link-floating.tsx
import { FC } from "react";
import { Editor } from "@tiptap/react";
import { ExternalLink, Unlink, FileSearch } from "lucide-react";
import Divider from "../divider";

export interface LinkFloatingProps {
  editor: Editor;
  updatePosition(): void;
  getPos: () => number;
  onGeneratePreview?: () => Promise<void>;
}

const LinkFloating: FC<LinkFloatingProps> = ({
  editor,
  getPos,
  onGeneratePreview,
}) => {
  const handleUnlink = () => {
    const pos = getPos();
    editor
      .chain()
      .focus()
      .setTextSelection(pos)
      .unsetLink()
      .run();
  };

  const handleGeneratePreview = async () => {
    if (onGeneratePreview) {
      await onGeneratePreview();
    }
  };

  const url = editor.getAttributes('link').href;

  return (
    <div className="flex items-center backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-md">
      <div className="flex items-center backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-md">
      <button
        type="button"
        onClick={() => window.open(url, '_blank')}
        className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
      >
        <ExternalLink className="w-4 h-4" />
      </button>
      <Divider className="mx-0.5" />
      <button
        type="button"
        onClick={handleUnlink}
        className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
      >
        <Unlink className="w-4 h-4" />
      </button>
      <Divider className="mx-0.5" />
      <button
        type="button"
        onClick={handleGeneratePreview}
        className="p-1.5 hover:bg-white/90 dark:hover:bg-gray-600/90"
      >
        <FileSearch className="w-4 h-4" />
      </button>
    </div>
    </div>
  );
};

export default LinkFloating;