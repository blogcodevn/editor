// src/editor/toolbars/media/link.tsx
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
      const wrapper = document.createElement('div');
      wrapper.classList.add('link-wrapper');
      
      const a = document.createElement('a');
      a.href = node.attrs.href;
      a.target = node.attrs.target || '_blank';
      a.rel = 'noopener noreferrer';
      a.classList.add('link');
      wrapper.append(a);

      const portalContainer = document.createElement('div');
      portalContainer.setAttribute('data-floating-controls', '');
      document.body.appendChild(portalContainer);

      const updatePosition = () => {
        if (!wrapper.isConnected) return;

        const rect = wrapper.getBoundingClientRect();
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;

        portalContainer.style.position = 'fixed';
        portalContainer.style.left = `${rect.left}px`;
        portalContainer.style.top = `${rect.top - 40}px`;
        portalContainer.style.visibility = isOutOfView ? 'hidden' : 'visible';
        portalContainer.style.pointerEvents = isOutOfView ? 'none' : 'auto';
        portalContainer.style.zIndex = '50';
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
        dom: wrapper,
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