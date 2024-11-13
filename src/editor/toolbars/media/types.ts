import { ComponentType } from "react";
import { CommonGroupProps } from "../../types";
import { UploadResult } from "../common/image-input";
import { ImageFormValue } from "../common/image-form";

declare module '@tiptap/core' {
  interface EditorEvents {
    'openImageEditModal': (props: Partial<ImageValue>) => void;
  }
}

declare module '@tiptap/extension-image' {
  interface ImageOptions {
    handleImageEdit?: (value: Partial<ImageValue>) => void;
  }
}

export type MediaType = "image";

export interface MediaFactoryConfig {
  onUploadImage(form: FormData): Promise<UploadResult>;
}

export type MediaGroupComponent = ComponentType<CommonGroupProps<MediaType>> & {
  displayName?: string;
};

export interface ImageValue extends ImageFormValue {
  width: number | string;
  height: number | string;
  objectFit: string;
}
