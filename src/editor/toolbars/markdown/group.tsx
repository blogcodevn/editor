import { FC, useCallback, useMemo, useRef, useState } from "react";
import { toHtml } from "hast-util-to-html";
import { Activity, Boxes, ChevronDown, Code, Database, GitBranch, Target } from "lucide-react";
import { CommonGroupProps, EditorIcon } from "../../types";
import { handleJSX, lowlight } from "./utils";
import MarkdownIt from "markdown-it";
import Group from "../common/group";
import ToolbarButton from "../common/toolbar-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Modal, { ModalRef } from "../common/modal";
import MermaidForm from "./mermaid-form";
import { DialogFooter } from "@/components/ui/dialog";
import Button from "../common/button";

export type MarkdownType = "codeBlock" | "dbdiagram" | "flowchart";

export type MarkdownGroupIcons = {
  codeBlock: EditorIcon;
  dbdiagram?: EditorIcon; 
  flowchart?: EditorIcon;
};

const MERMAID_TYPES = [
  { value: 'erDiagram', label: 'Entity Relationship', icon: Database },
  { value: 'flowchart', label: 'Flowchart', icon: GitBranch },
  { value: 'sequenceDiagram', label: 'Sequence', icon: Activity },
  { value: 'classDiagram', label: 'Class', icon: Boxes },
  { value: 'stateDiagram', label: 'State', icon: Target },
];

export type MarkdownGroupProps = CommonGroupProps<MarkdownType, MarkdownGroupIcons>;

const ToolbarGroup: FC<MarkdownGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const mermaidModalRef = useRef<ModalRef>(null);
  const [mermaidType, setMermaidType] = useState('');
  const [mermaidContent, setMermaidContent] = useState('');

  const items = useMemo(() => [
    {
      type: "codeBlock",
      Icon: (icons as MarkdownGroupIcons).codeBlock || Code,
      onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
      active: !!editor?.isActive("codeBlock"),
    },
  ] as const, [icons, editor]);

  const isIncluded = useCallback((type: MarkdownType) => !exclude.includes(type), [exclude]);

  const renderButton = useCallback(
    (item: typeof items[number]) => {
      if (!isIncluded(item.type)) {
        return null;
      }

      return (
        <ToolbarButton
          key={item.type}
          Icon={item.Icon}
          onClick={item.onClick}
          active={item.active}
          className={btnClassName}
        />
      );
    },
    [isIncluded, btnClassName]
  );

  const handleOpenMermaidModal = (type: string) => {
    setMermaidType(type);
    setMermaidContent('');
    mermaidModalRef.current?.open();
  };

  const handleInsertMermaid = () => {
    if (!mermaidContent || !editor) return;
 
    editor
      .chain()
      .focus()
      .setNode('codeBlock', { 
        language: 'mermaid',
        content: `${mermaidType}\n${mermaidContent}` 
      })
      .run();
    
    mermaidModalRef.current?.close();
  };

  return (
    <>
      <Group className={className}>
        <div className="flex items-center">
          {items.map(renderButton)}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <ChevronDown className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1">
            {MERMAID_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleOpenMermaidModal(type.value)}
                  className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
            </PopoverContent>
          </Popover>
        </div>
      </Group>
      <Modal
        ref={mermaidModalRef}
        title={`Create ${MERMAID_TYPES.find(t => t.value === mermaidType)?.label || ''} Diagram`}
        className="w-[640px] min-w-[640px] max-w-[640px]"
      >
        <div className="space-y-4">
         <MermaidForm
           type={mermaidType}
           content={mermaidContent}
           onChange={setMermaidContent}
         />
         
         <DialogFooter className="border-t border-gray-300 dark:border-gray-700 p-4">
           <Button
             variant="outline"
             onClick={() => mermaidModalRef.current?.close()}
             fullWidth={false}
             size="sm"
           >
             Cancel
           </Button>
           <Button
             onClick={handleInsertMermaid}
             disabled={!mermaidContent}
             fullWidth={false}
             size="sm"
           >
             Insert
           </Button>
         </DialogFooter>
       </div>
      </Modal>
    </>
  );
};

type MarkdownGroupComponent = typeof ToolbarGroup & {
  parser(content: string): string;
};

const parser = (source: string, env?: unknown) => {
  const parser = new MarkdownIt({
    highlight: (code: string, language: string): string => {
      try {
        let highlightedCode = "";
        
        if (language === "jsx") {
          highlightedCode = handleJSX(code, "javascript");
        } else if (language === 'tsx') {
          highlightedCode = handleJSX(code, "typescript");
        } else {
          const validLang = language && lowlight.listLanguages().includes(language);
          highlightedCode = validLang
            ? toHtml(lowlight.highlight(language, code))
            : MarkdownIt().utils.escapeHtml(code);
        }
  
        return `<pre class="hljs"><code>${highlightedCode}</code></pre>`;
      } catch (error) {
        console.error('Highlighting error:', error);
        return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(code)}</code></pre>`;
      }
    },
  });
  return parser.render(source, env);
}

const MarkdownGroup: MarkdownGroupComponent = Object.assign(
  ToolbarGroup,
  { parser }
);

MarkdownGroup.displayName = "@blogcode/editor/MarkdownGroup";
export default MarkdownGroup;
