import { createRoot } from "react-dom/client";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { isAllowedUrl } from "../common/utils";
import ImageFloating from "./image-floating";

const Image = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      caption: {
        default: null,
      }
    };
  },
  addNodeView() {
    return ({ HTMLAttributes, editor, getPos }) => {
      const wrapperDiv = createWrapperDiv();
      const figure = createFigure();
      const img = createImage(HTMLAttributes);
      const portalContainer = createPortalContainer();
      
      const { updatePosition, cleanup } = setupPositionHandlers(wrapperDiv, portalContainer);
      const imageExtensions = editor.extensionManager.extensions.find(extension => extension.name === 'image');
      const internalDomains = imageExtensions?.options?.internalDomains;
      const showSync = HTMLAttributes.src && !isAllowedUrl(HTMLAttributes.src, internalDomains);

      const handleSync = async () => {
        const onUploadImage = imageExtensions?.options?.onUploadImage;

        if (!onUploadImage || !getPos) return;
        try {
          const response = await fetch(HTMLAttributes.src);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('file', blob);
          
          const result = await onUploadImage(formData);
          if (result.url) {
            editor
              .chain()
              .setNodeSelection(getPos())
              .updateAttributes('image', { src: result.url })
              .run();
          }
        } catch (error) {
          console.error('Failed to sync image:', error);
        }
      };

      // Create floating controls
      const root = createRoot(portalContainer);
      root.render(
        <ImageFloating 
          editor={editor}
          getPos={getPos}
          updatePosition={updatePosition}
          showSync={showSync}
          onSync={handleSync}
        />
      );

      // Build DOM structure
      figure.append(img);
      if (HTMLAttributes.caption) {
        figure.append(createCaption(HTMLAttributes.caption));
      }
      wrapperDiv.append(figure);

      // Initial position
      requestAnimationFrame(updatePosition);

      return {
        dom: wrapperDiv,
        contentDOM: null,
        destroy: () => {
          cleanup();
          root.unmount();
        }
      }
    }
  }
});

interface ImageAttributes {
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  style?: string;
  class?: string;
  [key: string]: string | undefined;
}

interface PositionHandlers {
  updatePosition: () => void;
  cleanup: () => void;
}

function createWrapperDiv() {
  const div = document.createElement('div');
  div.classList.add('flex', 'justify-center');
  return div;
}

function createFigure() {
  const figure = document.createElement('figure');
  figure.classList.add('media-image-wrapper');
  return figure;
}

function createImage(attrs: ImageAttributes) {
  const img = document.createElement('img');
  Object.entries(attrs).forEach(([key, value]) => {
    if (key !== 'caption' && value) {
      img.setAttribute(key, value);
    }
  });
  img.classList.add('media-image');
  return img;
}

function createCaption(content: string) {
  const figcaption = document.createElement('figcaption');
  figcaption.innerHTML = content;
  figcaption.className = 'text-center text-sm text-gray-500 mt-1';
  return figcaption;
}

function createPortalContainer() {
  const container = document.createElement('div');
  container.setAttribute('data-floating-controls', '');
  document.body.appendChild(container);
  return container;
}

function setupPositionHandlers(wrapper: HTMLElement, portal: HTMLElement): PositionHandlers {
  const updatePosition = () => {
    if (!wrapper.isConnected) return;

    const rect = wrapper.getBoundingClientRect();
    const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight;

    portal.style.position = 'fixed';
    portal.style.left = `${rect.left + 8}px`;
    portal.style.top = `${rect.top + 8}px`;
    portal.style.visibility = isOutOfView ? 'hidden' : 'visible';
    portal.style.pointerEvents = isOutOfView ? 'none' : 'auto';
    portal.style.zIndex = '50';
  };

  const handleScroll = () => requestAnimationFrame(updatePosition);
  const handleResize = () => requestAnimationFrame(updatePosition);

  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleResize);

  const cleanup = () => {
    window.removeEventListener('scroll', handleScroll, true);
    window.removeEventListener('resize', handleResize);
    portal.remove();
  };

  return { updatePosition, cleanup };
}

export default Image;
