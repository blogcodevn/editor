import { ChangeEvent, FC, MouseEvent, useEffect, useMemo, useState } from "react";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import languages from "./languages";

export interface MarkdownFloatingProps {
  getPos(): number;
  updatePosition(): void;
  language: string;
  editor: Editor;
}

const MarkdownFloating: FC<MarkdownFloatingProps> = (props) => {
  const { getPos, updatePosition, language, editor } = props;

  const [ isOpen, setIsOpen ] = useState(false);
  const [ search, setSearch ] = useState("");

  const filteredLanguages = useMemo(() => {
    if (search === '') {
      if (language === 'mermaid') {
        // Chỉ hiển thị các mermaid diagrams khi đang ở mermaid
        return ['erDiagram', 'flowchart TD', 'flowchart LR', 'sequenceDiagram', 'classDiagram']
      }
      return Object.keys(languages).sort();
    }
    return Object.keys(languages).filter((lang) => {
      return lang.toLowerCase().includes(search.toLowerCase())
    }).sort();
  }, [search, language]);

  useEffect(() => {
    isOpen && updatePosition();
  }, [isOpen, updatePosition]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const updateLanguage = (lang: string) => () => {
    if (language === 'mermaid') {
      // Nếu đang là mermaid, update content thay vì language
      editor
        .chain()
        .focus()
        .setNodeSelection(getPos())
        .updateAttributes('codeBlock', { 
          content: `${lang}\n  ` 
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setNodeSelection(getPos())
        .updateAttributes('codeBlock', { language: lang })
        .run();
    }
    setIsOpen(false);
  }

  const handleOpenAutoFocus = (e: Event) => e.preventDefault();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground shadow-md",
            "hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
            "focus:ring-primary",
          )}
        >
          <Settings2 className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="end" 
        className="w-56 p-2"
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <div className="space-y-2">
          <Input
            type="search"
            placeholder="Search language..."
            value={search}
            onChange={handleChange}
            className="h-8"
          />
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {filteredLanguages.map((lang) => (
              <button
                key={lang}
                onClick={updateLanguage(lang)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-sm",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  language === lang && "bg-gray-100 dark:bg-gray-800 text-primary"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

MarkdownFloating.displayName = "@blogcode/editor/MarkdownFloating";
export default MarkdownFloating;
