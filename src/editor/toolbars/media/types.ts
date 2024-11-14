import { ComponentType } from "react";
import { CommonGroupProps } from "../../types";
import { UploadResult } from "../common/image-input";
import { ImageFormValue } from "../common/image-form";

declare module '@tiptap/core' {
  interface EditorEvents {
    'openImageEditModal': (props: Partial<ImageValue>) => void;
  }
}

declare module '@tiptap/react' {
  interface EditorOptions {
    internalDomains?: string[];
    onUploadImage?: (formData: FormData) => Promise<UploadResult>;
  }
}

declare module '@tiptap/extension-image' {
  export interface ImageOptions {
    internalDomains?: string[];
    onUploadImage?: (formData: FormData) => Promise<UploadResult>;
  }
}

export type MediaType = "image" | "link";

export interface MediaFactoryConfig {
  onUploadImage(form: FormData): Promise<UploadResult>;
  internalDomains?: string[];
}

export type MediaGroupComponent = ComponentType<CommonGroupProps<MediaType>> & {
  displayName?: string;
};

export interface ImageValue extends ImageFormValue {
  width: number | string;
  height: number | string;
  objectFit: string;
}
