import { FC, useCallback, useMemo } from "react";
import { toHtml } from "hast-util-to-html";
import { Code } from "lucide-react";
import { CommonGroupProps, EditorIcon } from "../../types";
import { handleJSX, lowlight } from "./utils";
import MarkdownIt from "markdown-it";
import Group from "../common/group";
import ToolbarButton from "../common/toolbar-button";

export type MarkdownType = "codeBlock";

export type MarkdownGroupIcons = {
  codeBlock: EditorIcon;
};

export type MarkdownGroupProps = CommonGroupProps<MarkdownType, MarkdownGroupIcons>;

const ToolbarGroup: FC<MarkdownGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName } = props;

  const items = useMemo(() => [
    {
      type: "codeBlock",
      Icon: (icons as MarkdownGroupIcons).codeBlock || Code,
      onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
      active: !!editor?.isActive("codeBlock"),
    }
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

  return (
    <Group className={className}>
      {items.map(renderButton)}
    </Group>
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
