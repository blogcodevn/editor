import { createRoot } from "react-dom/client";
import { Table as TiptapTable } from "@tiptap/extension-table";
import TableFloating from "./floating";

const Table = TiptapTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isFullWidth: {
        default: true,
        parseHTML: (element) => {
          const width = element.style.width;
          return width === "100%" || !width;
        },
        renderHTML: (attributes) => {
          return attributes.isFullWidth ? { width: "100%" } : {};
        }
      },
      alignment: {
        default: "left",
        parseHTML: (element) => {
          const ml = element.style.marginLeft;
          const mr = element.style.marginRight;
          
          if (ml === "auto" && mr === "auto") {
            return "center";
          }

          if (ml === "auto" && mr === "0px") {
            return "right";
          }

          return "left";
        },
        renderHTML: attributes => {
          const margin = {
            left: { marginLeft: "auto", marginRight: "0px" },
            center: { marginLeft: "auto", marginRight: "auto" },
            right: { marginLeft: "0px", marginRight: "auto" },
          };
          
          return margin[attributes.alignment as "left" | "center" | "right"];
        }
      },
      caption: {
        default: null,
        parseHTML: (element) => {
          const caption = element.querySelector("caption")
          return caption?.innerHTML;
        },
        renderHTML: (attributes) => {
          if (!attributes.caption) {
            return {};
          }

          const caption = document.createElement("caption");
          caption.innerHTML = attributes.caption;
          return { caption: caption.outerHTML };
        }
      },
      borderColor: {
        default: "#4b5563",
        parseHTML: (element) => {
          return element.style.getPropertyValue("--blogcode-table-color") || "#4b5563";
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
    return ({ node, editor }) => {
      const table = document.createElement("table");
      const tableAttrs = node.attrs;

      console.log(tableAttrs);

      if (tableAttrs.borderColor) {
        table.style.setProperty("--blogcode-table-color", tableAttrs.borderColor);
      }

      if (tableAttrs.isFullWidth) {
        table.style.width = "100%";
      } else {
        table.style.width = "auto";
        switch (tableAttrs.alignment) {
          case 'left':
            table.style.marginRight = 'auto';
            table.style.marginLeft = '0px';
            break;
          case 'center':
            table.style.marginLeft = 'auto';
            table.style.marginRight = 'auto';
            break;
          case 'right':
            table.style.marginLeft = 'auto';
            table.style.marginRight = '0px';
            break;
        }
      }

      if (tableAttrs.caption) {
        const captionElement = document.createElement("caption");
        captionElement.innerHTML = tableAttrs.caption;
        table.appendChild(captionElement);
      }
      
      const portalContainer = document.createElement("div");
      portalContainer.classList.add("fixed", "flex", "justify-end", "items-center");
      portalContainer.setAttribute("data-floating-controls", "");
      document.body.appendChild(portalContainer);

      const updatePosition = () => {
        if (!table.isConnected) return;

        const rect = table.getBoundingClientRect();
        const editorRect = editor.view.dom.getBoundingClientRect();
        const isOutOfView = rect.top < editorRect.top || rect.bottom > editorRect.bottom;

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

      const updateActiveState = () => {
        const pos = editor.view.posAtDOM(table, 0);

        if (pos < 0) {
          return;
        }

        const $pos = editor.state.doc.resolve(pos);
        const tableNode = $pos.node();

        const isActive = (
          !!tableNode &&
          editor.state.selection.from >= pos &&
          editor.state.selection.to <= pos + tableNode.nodeSize
        );

        const hasSelected = table.classList.contains("selected");

        if (isActive) {
          hasSelected || table.classList.add("selected");
        } else {
          hasSelected && table.classList.remove("selected");
        }
      };

      updateActiveState();
      editor.on("transaction", updateActiveState);

      const root = createRoot(portalContainer);
      root.render(<TableFloating table={table} editor={editor} updatePosition={updatePosition} />);

      return {
        dom: table,
        contentDOM: table,
        destroy() {
          window.removeEventListener("scroll", handleScroll, true);
          window.removeEventListener("resize", handleResize);
          root.unmount();
          portalContainer.remove();
          editor.off("transaction", updateActiveState);
        },
      }
    }
  }
});

export default Table;
