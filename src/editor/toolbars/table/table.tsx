import { createRoot } from "react-dom/client";
import { Table as TiptapTable } from "@tiptap/extension-table";
import TableFloating from "./floating";
import Util from "../../util";

const Table = TiptapTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isFullWidth: {
        default: true,
        parseHTML: element => element.parentElement?.hasAttribute("data-table-full"),
        renderHTML: attributes => {
          return attributes.isFullWidth ? { "data-table-full": "" } : {}
        }
      },
      alignment: {
        default: "left",
        parseHTML: element => {
          const noDefault = ["center", "right"];
          const value = element.getAttribute("data-table-alignment") || "left";
          return noDefault.includes(value) ? value : "left";
        },
        renderHTML: attributes => {
          return { "data-table-alignment": attributes.alignment };
        }
      },
      caption: {
        default: null,
        parseHTML: element => {
          const caption = element.querySelector("caption")
          return caption?.innerHTML
        },
        renderHTML: attributes => {
          if (!attributes.caption) return {}
          
          const caption = document.createElement("caption")
          caption.innerHTML = attributes.caption
          return { caption: caption.outerHTML }
        }
      },
      borderColor: {
        default: "#4b5563",
        parseHTML: (element) => {
          const parent = element.parentElement;
          const borderColor = parent?.style.getPropertyValue("--blogcode-table-color");
          return borderColor || "#4b5563";
        },
        renderHTML: (attributes) => {
          return {
            "--blogcode-table-color": attributes.borderColor,
          };
        },
      },
    }
  },
  addNodeView() {
    return ({ HTMLAttributes, editor }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("table-wrapper");

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (key.startsWith("--")) {
          wrapper.style.setProperty(key, value);
        } else {
          wrapper.setAttribute(key, value);
        }
      });
      
      const table = document.createElement("table");
      
      const portalContainer = document.createElement("div");
      portalContainer.setAttribute("data-floating-controls", "");
      document.body.appendChild(portalContainer);

      const updatePosition = () => {
        if (!wrapper.isConnected) return;

        const rect = wrapper.getBoundingClientRect();
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;

        portalContainer.classList.add(...[
          "fixed",
          "flex",
          "justify-end",
          "items-center",
        ]);
        
        // Anchor floating button to table top-right
        portalContainer.style.right = `${window.innerWidth - rect.right}px`;
        portalContainer.style.top = `${rect.top - 10}px`;    // Position slightly above table
        portalContainer.style.visibility = isOutOfView ? "hidden" : "visible";
        portalContainer.style.pointerEvents = isOutOfView ? "none" : "auto";
      };

      // Initial position
      requestAnimationFrame(updatePosition);

      // Update on scroll/resize
      const handleScroll = () => requestAnimationFrame(updatePosition);
      const handleResize = () => requestAnimationFrame(updatePosition);

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      wrapper.append(table);
      
      const placeholder = document.createElement("p");
      const br = document.createElement("br");
      br.classList.add("ProseMirror-trailingBreak");
      placeholder.append(br);

      const addPlaceholder = () => {
        if (!wrapper.parentElement) {
          return;
        }

        const nextSibling = wrapper.nextElementSibling;

        console.log({ nextSibling });

        if (!nextSibling || (nextSibling.nodeType !== Node.TEXT_NODE && !nextSibling.textContent?.trim())) {
          wrapper.insertAdjacentElement("afterend", placeholder);
          return;
        }
      };

      const observer = new MutationObserver(() => {
        if (wrapper.parentElement && !wrapper.nextElementSibling) {
          addPlaceholder();
        }
      });

      observer.observe(editor.view.dom, {
        childList: true,
        subtree: true,
      });

      const updateActiveState = () => {
        const isActive = editor.isActive("table");
        const hasSelected = wrapper.classList.contains("selected");

        if (isActive) {
          const domNode = wrapper.querySelector("table");
          const pos = domNode ? editor.view.posAtDOM(domNode, 0) : -1;

          if (pos < 0) {
            hasSelected && wrapper.classList.remove("selected");
            return;
          }

          const resolvedPos = Util.doc(editor).resolve(pos);

          if (!resolvedPos) {
            hasSelected && wrapper.classList.remove("selected");
            return;
          }

          const anchorPos = Util.$anchor(editor).pos;

          if (anchorPos < pos) {
            hasSelected && wrapper.classList.remove("selected");
            return;
          }

          const tableNode = resolvedPos.node();

          if (!tableNode || tableNode.type.name !== "table") {
            hasSelected && wrapper.classList.remove("selected");
            return;
          }

          const tableSize = tableNode.nodeSize;

          if (anchorPos <= pos + tableSize) {
            hasSelected || wrapper.classList.add("selected");
          } else {
            hasSelected && wrapper.classList.remove("selected");
          }
        } else {
          hasSelected && wrapper.classList.remove("selected");
        }
      };

      updateActiveState();
      editor.on("transaction", updateActiveState);

      if (editor.isActive("table")) {
        wrapper.classList.add("selected");
      }

      const root = createRoot(portalContainer);
      root.render(<TableFloating wrapper={wrapper} editor={editor} updatePosition={updatePosition} />);

      return {
        dom: wrapper,
        contentDOM: table,
        destroy() {
          window.removeEventListener("scroll", handleScroll, true);
          window.removeEventListener("resize", handleResize);
          root.unmount();
          portalContainer.remove();

          observer.disconnect();
          if (placeholder.parentElement) {
            placeholder.remove();
          }

          // interval && clearInterval(interval);
          editor.off("transaction", updateActiveState);
        },
      }
    }
  }
});

export default Table;
