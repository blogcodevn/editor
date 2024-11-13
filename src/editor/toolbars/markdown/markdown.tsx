import { createRoot } from "react-dom/client";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import MarkdownFloating from "./floating";

const Markdown = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "plain",
        parseHTML: element => {
          const className = element.getAttribute("class") || "";
          const match = className.match(/language-(\w+)/);
          return match ? match[1] : "plain";
        },
        renderHTML: attributes => {
          return {
            class: `language-${attributes.language || "plain"}`,
          };
        }
      }
    };
  },
  addNodeView() {
    return ({ node, HTMLAttributes, editor, getPos }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("code-block-wrapper");

      const pre = document.createElement("pre");
      const code = document.createElement("code");

      const language = node.attrs.language || "plain";
      const className = `language-${language}`;

      pre.classList.add(className);
      code.classList.add(`${className}-inner`);

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        pre.setAttribute(key, value);
      });

      const portal = document.createElement("div");
      portal.setAttribute("data-floating-controls", "");
      document.body.appendChild(portal);

      const updatePosition = () => {
        if (!wrapper.isConnected) {
          return;
        }

        const rect = wrapper.getBoundingClientRect();
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;

        portal.style.position = "fixed";
        portal.style.left = `${rect.right - 24}px`;
        portal.style.top = `${rect.top - 10}px`;
        portal.style.visibility = isOutOfView ? "hidden" : "visible";
        portal.style.pointerEvents = isOutOfView ? "none" : "auto";
      };

      requestAnimationFrame(updatePosition);

      const handleScroll = () => requestAnimationFrame(updatePosition);
      const handleResize = () => requestAnimationFrame(updatePosition);

      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      pre.appendChild(code);
      wrapper.appendChild(pre);

      if (editor.isActive("codeBlock")) {
        wrapper.classList.add("selected");
      }

      const root = createRoot(portal);
      root.render(
        <MarkdownFloating 
          editor={editor}
          updatePosition={updatePosition}
          getPos={getPos}
          language={node.attrs.language}
        />
      );

      return {
        dom: wrapper,
        contentDOM: code,
        destroy() {
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleResize);
          root.unmount();
          portal.remove();
        },
      };
    };
  },
});

export default Markdown;
