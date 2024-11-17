import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommonGroupProps } from "@blogcode/editor/types";
import { ImageValue, MediaFactoryConfig, MediaType } from "./types";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import Modal, { ModalRef } from "@blogcode/editor/toolbars/common/modal";
import LinkForm, { LinkFormValue } from "./link-form";
import ImageForm from "@blogcode/editor/toolbars/common/image-form";
import Button from "@blogcode/editor/toolbars/common/button";
import Group from "@blogcode/editor/toolbars/common/group";
import ToolbarButton from "@blogcode/editor/toolbars/common/toolbar-button";
import TextInput from "@blogcode/editor/toolbars/common/text-input";
import Select from "@blogcode/editor/toolbars/common/select";
import IconLink from "@blogcode/editor/icons/icon-link";
import IconImage from "@blogcode/editor/icons/icon-image";
import "./media.css";

export interface MediaGroupIcons {
  image?: SvgIcon;
  link?: SvgIcon;
}

export type MediaGroupProps = CommonGroupProps<MediaType, MediaGroupIcons> & MediaFactoryConfig;

const MediaGroup: FC<MediaGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName, onUploadImage } = props;

  const modalRef = useRef<ModalRef>(null);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<Partial<ImageValue>>({});

  const linkModalRef = useRef<ModalRef>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkValue, setLinkValue] = useState<Partial<LinkFormValue>>({});

  const handleClickLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive('link')) {
      const attrs = editor.getAttributes('link');
      const text = editor.state.doc.textBetween(
        editor.state.selection.$from.pos,
        editor.state.selection.$to.pos,
        '',
      );
      setLinkValue({
        url: attrs.href,
        text,
        title: attrs.title,
        target: attrs.target || '_blank',
        rel: attrs.rel,
        class: attrs.class,
      });
    } else {
      const text = editor.state.doc.textBetween(
        editor.state.selection.$from.pos,
        editor.state.selection.$to.pos,
        '',
      );
      setLinkValue({ 
        text, 
        target: '_blank', 
        title: text,
      });
    }
    linkModalRef.current?.open();
  }, [editor]);

  const items = useMemo(() => [
    {
      type: "link" as const,
      Icon: icons.link || IconLink,
      onClick: handleClickLink,
      active: editor?.isActive('link') || false,
    },
    {
      type: "image" as const,
      Icon: icons.image || IconImage,
      onClick: () => modalRef.current?.open(),
      active: false,
    },
  ], [icons, editor, handleClickLink]);

  const events = useMemo(() => ({
    handleImageEdit: (value: Partial<ImageValue>) => {
      setFormValue(value);
      modalRef.current?.open();
    }
  }), []);

  useEffect(() => {
    if (editor) {
      const imageExtension = editor.extensionManager.extensions.find(ext => ext.name === 'image');
      if (imageExtension) {
        imageExtension.options = {
          ...imageExtension.options,
          handleImageEdit: events.handleImageEdit
        };
      }
    }
  }, [editor, events]);

  const isIncluded = useCallback(
    (type: MediaType) => !exclude.includes(type),
    [exclude]
  );

  const handleClose = useCallback(() => {
    setFormValue({});
  }, []);

  const handleInsertImage = async () => {
    if (!formValue.image || !editor) return;
   
    setLoading(true);
    try {
      const style = [];
      if (formValue.width) {
        // Kiểm tra nếu là số thì thêm px, ngược lại giữ nguyên (có thể là %, rem, etc)
        const width = !isNaN(Number(formValue.width)) ? `${formValue.width}px` : formValue.width;
        style.push(`width: ${width}`);
      }
      if (formValue.height) {
        const height = !isNaN(Number(formValue.height)) ? `${formValue.height}px` : formValue.height;
        style.push(`height: ${height}`);
      }
      if (formValue.objectFit) style.push(`object-fit: ${formValue.objectFit}`);
   
      editor
        .chain()
        .focus()
        .setImage({
          src: formValue.image,
          alt: formValue.alt,
          title: formValue.caption,
        })
        .run();
   
      // Cập nhật thêm style và caption
      const node = editor.state.doc.nodeAt(editor.state.selection.$anchor.pos);
      if (node) {
        editor
          .chain()
          .updateAttributes('image', {
            style: style.length > 0 ? style.join('; ') : null,
            caption: formValue.caption
          })
          .run();
      }
   
      modalRef.current?.close();
    } catch (error) {
      console.error('Failed to insert image:', error);
    }
    setLoading(false);
  };

  const handleInsertLink = () => {
    if (!linkValue.url || !editor) return;

    setLinkLoading(true);
    try {
      const attrs = {
        href: linkValue.url,
        title: linkValue.title || null,
        target: linkValue.target || null,
        rel: linkValue.rel || null,
        class: linkValue.class || null
      };

      if (linkValue.text && !editor.isActive('link')) {
        // Insert link mới với text mới
        editor.chain()
          .focus()
          .insertContent(linkValue.text)
          .setLink(attrs)
          .run();
      } else {
        // Update link hiện tại hoặc convert selection thành link
        editor.chain()
          .focus()
          .setLink(attrs)
          .run();
      }
      linkModalRef.current?.close();
    } catch (error) {
      console.error('Failed to insert/update link:', error);
    }
    setLinkLoading(false);
  };

  const renderButton = useCallback(
    (item: typeof items[number]) => {
      if (!isIncluded(item.type)) return null;

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
    <>
      <Group className={className}>
        {items.map(renderButton)}
      </Group>

      <Modal
        ref={modalRef}
        title="Insert Image"
        onClose={handleClose}
      >
        <div className="space-y-4">
          <ImageForm
            value={formValue}
            onChange={setFormValue}
            controlProps={{
              image: {
                preview: true,
                previewSize: "md",
                placeholder: "Enter image URL or upload...",
                onUpload: onUploadImage
              },
            }}
          >
            <div className="flex gap-2">
              <div className="w-[25%] min-w-[25%]">
                <Label className="block text-right text-xs">Setting</Label>
              </div>
              <div className="flex-grow grid grid-cols-3 gap-2">
                <TextInput
                  size="sm"
                  label="Width"
                  placeholder="e.g. 300px or 100%"
                  value={formValue.width}
                  onChange={(e) => setFormValue(prev => ({ ...prev, width: e.target.value }))}
                />
                <TextInput
                  size="sm"
                  label="Height"
                  placeholder="e.g. 200px"
                  value={formValue.height}
                  onChange={(e) => setFormValue(prev => ({ ...prev, height: e.target.value }))}
                />
                <Select
                  options={[
                    { value: "auto", label: "Auto" },
                    { value: "cover", label: "Cover" },
                    { value: "contain", label: "Contain" },
                    { value: "fill", label: "Fill" },
                    { value: "none", label: "None" },
                    { value: "scale-down", label: "Scale Down" },
                  ]}
                  value={formValue.objectFit}
                  onValueChange={(value) => setFormValue(prev => ({ ...prev, objectFit: value }))}
                  label="Object Fit"
                  size="sm"
                  
                />
              </div>
            </div>
          </ImageForm>
          <DialogFooter className="border-t border-gray-300 dark:border-gray-700 p-4">
            <Button
              variant="outline"
              onClick={() => modalRef.current?.close()}
              fullWidth={false}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsertImage}
              loading={loading}
              disabled={!formValue.image}
              fullWidth={false}
              size="sm"
            >
              Insert
            </Button>
          </DialogFooter>
        </div>
      </Modal>
      <Modal
        ref={linkModalRef}
        title="Insert Link"
        onClose={() => setLinkValue({})}
      >
        <div className="space-y-4">
          <LinkForm
            value={linkValue}
            onChange={setLinkValue}
          />
          
          <DialogFooter className="border-t border-gray-300 dark:border-gray-700 p-4">
            <Button
              variant="outline"
              onClick={() => linkModalRef.current?.close()}
              fullWidth={false}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsertLink}
              loading={linkLoading}
              disabled={!linkValue.url}
              fullWidth={false}
              size="sm"
            >
              Insert
            </Button>
          </DialogFooter>
        </div>
      </Modal>
    </>
  );
};

MediaGroup.displayName = "@blogcode/editor/MediaGroup";
export default MediaGroup;
