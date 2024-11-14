import { Root } from "hast";
import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { createLowlight } from "lowlight";
import languages from "./languages";

export const lowlight = createLowlight(languages);

export function handleMermaid(code: string): string {
  try {
    // Basic syntax highlighting for mermaid
    return code.split('\n').map(line => {
      if (line.trim().startsWith('erDiagram') || line.includes('flowchart')) {
        return `<span class="hljs-keyword">${line}</span>`;
      }
      // Add more syntax highlighting rules for mermaid here
      return line;
    }).join('\n');
  } catch (e) {
    console.warn('Failed to highlight mermaid code.', e);
    return code;
  }
}

export function handleJSX(code: string, baseLanguage: "javascript" | "typescript") {
  try {
    if (baseLanguage.includes('mermaid')) {
      return handleMermaid(code);
    }

    const baseResult = lowlight.highlight(baseLanguage, code);
    const xmlResult = lowlight.highlight('xml', code);

    const mergedTree: Root = {
      type: "root",
      children: baseResult.children || []
    };

    visit(xmlResult, "element", (node) => {
      if (
        node.properties?.className &&
        Array.isArray(node.properties.className) &&
        (
          node.properties.className.includes("hljs-tag") ||
          node.properties.className.includes("hljs-attr") ||
          node.properties.className.includes("hljs-string")
        )
      ) {
        mergedTree.children.push(node);
      }
    });

    return toHtml(mergedTree);
  } catch (e) {
    console.warn("Failed to highlight JSX code.", e);
    return code;
  }
}
