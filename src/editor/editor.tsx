import { ComponentType, FC, useEffect } from "react";
import { EditorContent, useEditor,  Editor as TiptapEditor, JSONContent } from "@tiptap/react";
import { CommonGroupProps } from "./types";
import { BasicExtensions, BasicGroup } from "./toolbars/basic";
import { ColorsExtensions, ColorsGroup } from "./toolbars/colors";
import { BlockGroup, BlockExtensions } from "./toolbars/block";
import { MarkdownExtensions, MarkdownGroup } from "./toolbars/markdown";
import { TableExtensions, TableGroup } from "./toolbars/table";
import { FontExtensions, FontGroup } from "./toolbars/font";
import { mediaFactory } from "./toolbars/media";
import { HeadingGroup } from "./toolbars/heading";
import { HistoryGroup } from "./toolbars/history";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlignmentGroup } from "./toolbars/alignment";
import { IndentGroup } from "./toolbars/indent";
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
  FontGroup,
  ColorsGroup,
  AlignmentGroup,
  HeadingGroup,
  BlockGroup,
  IndentGroup,
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
      ...FontExtensions,
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
        const content = serializeToMarkdown(editor); // editor.getText();

        // group.forEach((Group) => {
        //   if ("parser" in Group && typeof Group.parser === "function") {
        //     content = Group.parser(content);
        //   }
        // });

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

function serializeToMarkdown(editor: TiptapEditor): string {
  const json = editor.getJSON();
  return convertJSONToMarkdown(json);
}

function convertJSONToMarkdown(json: JSONContent): string {
  if (!json.content) {
    return "";
  }

  return json.content.map((node) => {
    switch (node.type) {
      case "paragraph":
        const text = node.content?.map((child) => handleBasicMarks(child)).join("") || "";
        return text + "\n\n";

      case "bulletList":
        return node.content?.map((child) => {
          return `- ${child.content?.map((item) => convertJSONToMarkdown(item)).join("") || ""}\n`;
        }).join("");

      case "orderedList":
        return node.content?.map((child, index) => {
          return `${index + 1}. ${child.content?.map((item) => convertJSONToMarkdown(item)).join("") || ""}\n`;
        }).join("");

      case "blockquote":
        return `> ${node.content?.map((child) => convertJSONToMarkdown(child)).join("") || ""}\n`;

      case "heading":
        const level = node.attrs?.level || 1;
        const headingText = node.content?.map((child) => handleBasicMarks(child)).join("") || "";
        return `${"#".repeat(level)} ${headingText}\n\n`;

      case "codeBlock":
        const language = node.attrs?.language || "";
        const codeContent = node.content?.map((child) => child.text || "").join("\n");
        return `\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;

      case "image":
        const imgAlt = node.attrs?.alt || "";
        const imgSrc = node.attrs?.src || "";
        const imgTitle = node.attrs?.title ? ` "${node.attrs?.title}"` : "";
        const imgStyle = node.attrs?.style ? ` {${node.attrs?.style}}` : "";
        const imgCaption = node.attrs?.caption || "";

        return [
          `<div style="text-align: center;">![${imgAlt}](${imgSrc}${imgTitle})${imgStyle}`,
          imgCaption ? `\n<figcaption>${imgCaption}</figcaption>` : "",
          "</div>\n\n",
        ].join("");

      case "link":
        const href = node.attrs?.href || "";
        const linkText = node.content?.map((child) => handleBasicMarks(child)).join("") || "";
        const linkTitle = node.attrs?.title ? ` "${node.attrs?.title}"` : "";
        let linkMarkdown = `[${linkText}](${href}${linkTitle})`;
        
        const target = node.attrs?.target ? ` target="${node.attrs?.target}"` : "";
        const rel = node.attrs?.rel ? ` rel="${node.attrs?.rel}"` : "";
        const className = node.attrs?.class ? ` class="${node.attrs?.class}"` : "";
        const titleAttr = node.attrs?.title ? ` title="${node.attrs?.title}"` : "";

        if (target || rel || className) {
          linkMarkdown = `<a href="${href}"${titleAttr}${target}${rel}${className}>${linkText}</a>`;
        }

        return linkMarkdown;

      case "table":
        const isFullWidth = node.attrs?.isFullWidth ?? true;
        const alignment = node.attrs?.alignment ?? "left";
        const tableCaption = node.attrs?.caption || "";

        let tableContent = `<div${isFullWidth ? " data-table-full" : ""}${alignment === "center" ? "data-table-centered" : ""}>\n`;

        // Header
        const headerRow = node.content?.[0]; // first row

        if (headerRow?.content) {
          tableContent += "|";
          headerRow.content.forEach((cell) => {
            const cellContent = cell.content?.map((child) => handleBasicMarks(child)).join("") || "";
            tableContent += ` ${cellContent} |`;
          });
          tableContent += "\n|";
          headerRow.content.forEach(() => {
            tableContent += " --- |";
          });
          tableContent += "\n";
        }

        // Body
        node.content?.slice(1).forEach((row) => {
          tableContent += "|";
          row.content?.forEach((cell) => {
            const cellContent = cell.content?.map((child) => handleBasicMarks(child)).join("") || "";
            tableContent += ` ${cellContent} |`;
          });
          tableContent += "\n";
        });

        if (tableCaption) {
          tableContent += `<caption>${tableCaption}</caption>\n`;
        }

        return tableContent + "\n</div>\n\n";

      default:
        return "";
    }
  }).join("");
}

function handleBasicMarks(node: JSONContent): string {
  if (!node.text) return '';
  
  let text = node.text;
  console.log({node});
  if (!node.marks) return text;
  
  // Xử lý các mark từ ngoài vào trong
  node.marks.forEach(mark => {
    switch (mark.type) {
      case 'bold':
        text = `**${text}**`;
        break;
      case 'italic':
        text = `*${text}*`;
        break;
      case 'strike':
        text = `~~${text}~~`;
        break;
      case 'underline':
        text = `<u>${text}</u>`;
        break;
      case 'textStyle':
        text = `<span style="color: ${mark.attrs?.color}">${text}</span>`;
        break;
      case "highlight":
        text = `<mark data-color="${mark.attrs?.color}" style="background-color: ${mark.attrs?.color}">${text}</mark>`;
        break;
      case "code":
        text = `\`${text}\``;
        break;
    }
  });
 
  return text;
 }

Editor.displayName = "@blogcode/editor/Editor";
export default Editor;
