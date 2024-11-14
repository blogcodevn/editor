import { FC, useEffect } from "react";
import { cn } from "@/lib/utils";
import CodeEditor from "../../components/code-editor";
import mermaid from "mermaid";

export interface MermaidFormProps {
  className?: string;
  type: string;
  content: string;
  onChange(content: string): void;
}

const MermaidForm: FC<MermaidFormProps> = ({ className, type, content, onChange }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  }, []);

  useEffect(() => {
    mermaid.contentLoaded();
  }, [content]);

  return (
    <div className={cn("grid grid-cols-2 gap-6 p-6", className)}>
      <div className="space-y-2">
        <div className="font-medium text-sm text-gray-500 dark:text-gray-400">{type}</div>
        <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <CodeEditor
            height="65vh"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => onChange(value || '')}
            darkMode
          />
        </div>
      </div>
      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 p-4">
        <div className="mermaid">
          {type}\n{content}
        </div>
      </div>
    </div>
  );
};

export default MermaidForm;
