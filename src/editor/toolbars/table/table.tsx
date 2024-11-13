import { createRoot } from 'react-dom/client';
import { Table as TiptapTable } from '@tiptap/extension-table'
import TableFloating from './floating';

const Table = TiptapTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      isFullWidth: {
        default: true,
        parseHTML: element => element.hasAttribute('data-full-width'),
        renderHTML: attributes => {
          return attributes.isFullWidth ? { 'data-full-width': '' } : {}
        }
      },
      alignment: {
        default: 'left',
        parseHTML: element => element.hasAttribute('data-centered') ? 'center' : 'left',
        renderHTML: attributes => {
          return attributes.alignment === 'center' ? { 'data-centered': '' } : {}
        }
      },
      caption: {
        default: null,
        parseHTML: element => {
          const caption = element.querySelector('caption')
          return caption?.innerHTML
        },
        renderHTML: attributes => {
          if (!attributes.caption) return {}
          
          const caption = document.createElement('caption')
          caption.innerHTML = attributes.caption
          return { caption: caption.outerHTML }
        }
      }
    }
  },
  addNodeView() {
    return ({ HTMLAttributes, editor }) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('table-wrapper');
      
      const table = document.createElement('table');
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        table.setAttribute(key, value);
      });

      const portalContainer = document.createElement('div');
      portalContainer.setAttribute('data-floating-controls', '');
      document.body.appendChild(portalContainer);

      const updatePosition = () => {
        if (!wrapper.isConnected) return;

        const rect = wrapper.getBoundingClientRect();
        const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;
        
        // Anchor floating button to table top-right
        portalContainer.style.position = 'fixed';
        portalContainer.style.left = `${rect.right - 24}px`;  // Adjust based on button size
        portalContainer.style.top = `${rect.top - 10}px`;    // Position slightly above table
        portalContainer.style.visibility = isOutOfView ? 'hidden' : 'visible';
        portalContainer.style.pointerEvents = isOutOfView ? 'none' : 'auto';
      };

      // Initial position
      requestAnimationFrame(updatePosition);

      // Update on scroll/resize
      const handleScroll = () => requestAnimationFrame(updatePosition);
      const handleResize = () => requestAnimationFrame(updatePosition);

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      wrapper.append(table);

      if (editor.isActive('table')) {
        wrapper.classList.add('selected');
      }

      const root = createRoot(portalContainer);
      root.render(<TableFloating editor={editor} updatePosition={updatePosition} />);

      return {
        dom: wrapper,
        contentDOM: table,
        destroy() {
          window.removeEventListener('scroll', handleScroll, true);
          window.removeEventListener('resize', handleResize);
          root.unmount();
          portalContainer.remove();
        }
      }
    }
  }
});

export default Table;
