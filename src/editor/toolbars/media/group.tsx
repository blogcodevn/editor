import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "lucide-react";
import { CommonGroupProps, EditorIcon } from "../../types";
import { ImageValue, MediaFactoryConfig, MediaType } from "./types";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import Modal, { ModalRef } from "../common/modal";
import ImageForm from "../common/image-form";
import Button from "../common/button";
import Group from "../common/group";
import ToolbarButton from "../common/toolbar-button";
import TextInput from "../common/text-input";
import Select from "../common/select";
import "./media.css";

export interface MediaGroupIcons {
  image?: EditorIcon;
}

export type MediaGroupProps = CommonGroupProps<MediaType, MediaGroupIcons> & MediaFactoryConfig;

const MediaGroup: FC<MediaGroupProps> = (props) => {
  const { exclude = [], icons = {}, editor, className, btnClassName, onUploadImage } = props;

  const modalRef = useRef<ModalRef>(null);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<Partial<ImageValue>>({});

  const items = useMemo(() => [
    {
      type: "image" as const,
      Icon: icons.image || Image,
      onClick: () => modalRef.current?.open(),
      active: false,
    }
  ], [icons]);

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

  const handleInsert = async () => {
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
              onClick={handleInsert}
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
    </>
  );
};

MediaGroup.displayName = "@blogcode/editor/MediaGroup";
export default MediaGroup;
