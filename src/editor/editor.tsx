import { ComponentType, FC, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { CommonGroupProps } from "./types";
import { BasicExtensions, BasicGroup } from "./toolbars/basic";
import { ColorsExtensions, ColorsGroup } from "./toolbars/colors";
import { BlockGroup, BlockExtensions } from "./toolbars/block";
import { MarkdownExtensions, MarkdownGroup } from "./toolbars/markdown";
import { TableExtensions, TableGroup } from "./toolbars/table";
import { HeadingGroup } from "./toolbars/heading";
import { HistoryGroup } from "./toolbars/history";
import { TooltipProvider } from "@/components/ui/tooltip";
import { mediaFactory } from "./toolbars/media";
import Toolbar from "./toolbars/toolbar";
import StarterKit from "@tiptap/starter-kit";
import "./editor.css";

const { MediaGroup, MediaExtensions } = mediaFactory({
  onUploadImage: async () => {
    return await new Promise((resolve) => setTimeout(() => resolve({ url: "/vercel.svg" }), 2000));
  }
});

const group = [
  BasicGroup,
  ColorsGroup,
  HeadingGroup,
  BlockGroup,
  TableGroup,
  MarkdownGroup,
  MediaGroup,
  HistoryGroup,
] as ComponentType<CommonGroupProps<string>>[];

export interface EditorProps {
  name?: string;
}

const Editor: FC<EditorProps> = (props) => {
  const { name } = props;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ...BasicExtensions,
      ...ColorsExtensions,
      ...BlockExtensions,
      ...TableExtensions,
      ...MediaExtensions,
      ...MarkdownExtensions
    ],
  });

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        let content = editor.getText();

        group.forEach((Group) => {
          if ("parser" in Group && typeof Group.parser === "function") {
            content = Group.parser(content);
          }
        });

        const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (input) {
          input.value = content;
        }
      });
    }
  }, [editor, name]);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <TooltipProvider>
        <Toolbar editor={editor} group={group} />
        <EditorContent editor={editor} className="blogcode-editor-content" />
        {!!name && <input type="hidden" name={name} />}
      </TooltipProvider>
    </div>
  );
};

Editor.displayName = "@blogcode/editor/Editor";
export default Editor;
