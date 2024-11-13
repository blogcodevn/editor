import { Root } from "hast";
import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import { createLowlight } from "lowlight";
import languages from "./languages";

export const lowlight = createLowlight(languages);

export function handleJSX(code: string, baseLanguage: "javascript" | "typescript") {
  try {
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
