import { Link as TiptapLink } from '@tiptap/extension-link';
import { NodeViewProps } from '@tiptap/react';
import { createRoot } from 'react-dom/client';
import LinkFloating from './link-floating';

const Link = TiptapLink.extend({
  inclusive: false,
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => {
          if (!attributes.title) return {}
          return { title: attributes.title }
        }
      }
    }
  },
  addNodeView() {
    return ({ editor, getPos, node }: NodeViewProps) => {
      // const wrapper = document.createElement('div');
      // wrapper.classList.add('link-wrapper');
      
      const a = document.createElement('a');
      a.href = node.attrs.href;
      a.target = node.attrs.target || '_blank';
      a.rel = 'noopener noreferrer';
      a.classList.add('link');
      // wrapper.append(a);

      const portalContainer = document.createElement('div');
      portalContainer.setAttribute('data-floating-controls', '');
      document.body.appendChild(portalContainer);
      portalContainer.classList.add("fixed", "flex", "items-center", "justify-start", "z-50")

      const updatePosition = () => {
        if (!a.isConnected) return;

        const rect = a.getBoundingClientRect();
        const editorRect = editor.view.dom.getBoundingClientRect();
        const isOutOfView = rect.top < editorRect.top || rect.bottom > editorRect.bottom;

        portalContainer.style.left = `${rect.left}px`;
        portalContainer.style.top = `${rect.top - 40}px`;
        portalContainer.style.visibility = isOutOfView ? 'hidden' : 'visible';
        portalContainer.style.pointerEvents = isOutOfView ? 'none' : 'auto';
      };

      const handleScroll = () => requestAnimationFrame(updatePosition);
      const handleResize = () => requestAnimationFrame(updatePosition);

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      const root = createRoot(portalContainer);
      root.render(
        <LinkFloating 
          editor={editor}
          getPos={getPos}
          updatePosition={updatePosition}
        />
      );

      requestAnimationFrame(updatePosition);

      return {
        dom: a,
        contentDOM: a,
        destroy() {
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
          root.unmount();
          portalContainer.remove();
        }
      };
    };
  },
});

export default Link;
