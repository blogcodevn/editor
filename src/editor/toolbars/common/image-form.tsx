/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import ImageInput, { ImageInputProps } from "./image-input";
import TextInput, { TextInputProps } from "./text-input";
import { cn } from "@/lib/utils";

export interface ImageFormValue {
  image: string;
  alt: string;
}

export interface ImageFormProps {
  className?: string;
  value?: Partial<ImageFormValue>;
  onChange?(value: ImageFormValue): void;
  controlProps?: {
    image?: ImageInputProps;
    alt?: TextInputProps;
  };
}

const ImageForm: FC<PropsWithChildren<ImageFormProps>> = (props) => {
  const { controlProps = {}, className, children, value, onChange } = props;

  const [ currentValue, setCurrentValue ] = useState({
    image: value?.image ?? "",
    alt: value?.alt ?? "",
  });

  useEffect(() => {
    if (value?.image !== currentValue.image || value?.alt !== currentValue.alt) {
      setCurrentValue({
        image: value?.image ?? "",
        alt: value?.alt ?? "",
      });
    }
  }, [value]);

  const handleChange = (field: "image" | "alt") => (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = {
      ...currentValue,
      [field]: e.target.value,
    };
    setCurrentValue((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    onChange?.(nextValue);
    controlProps[field]?.onChange?.(e);
  };

  return (
    <div className={cn("flex-grow overflow-auto p-4 grid gap-4", className)}>
      <ImageInput
        {...controlProps.image}
        value={currentValue.image}
        onChange={handleChange("image")}
        name={controlProps.image?.name ?? "image"}
        label={controlProps.image?.label ?? "Image"}
        labelPosition={controlProps.image?.labelPosition ?? "left"}
        labelAlign={controlProps.image?.labelAlign ?? "right"}
        size={controlProps.image?.size ?? "sm"}
      />
      <TextInput
        {...controlProps.alt}
        value={currentValue.alt}
        onChange={handleChange("alt")}
        name={controlProps.alt?.name ?? "alt"}
        label={controlProps.alt?.label ?? "Alt Text"}
        labelPosition={controlProps.alt?.labelPosition ?? "left"}
        labelAlign={controlProps.alt?.labelAlign ?? "right"}
        size={controlProps.alt?.size ?? "sm"}
      />
      {children}
    </div>
  );
};

ImageForm.displayName = "@blogcode/editor/ImageForm";
export default ImageForm;