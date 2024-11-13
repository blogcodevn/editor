import { ComponentType } from "react";
import { CommonGroupProps } from "../../types";
import { UploadResult } from "../common/image-input";

export type MediaType = "image";

export interface MediaFactoryConfig {
  onUploadImage(form: FormData): Promise<UploadResult>;
}

export type MediaGroupComponent = ComponentType<CommonGroupProps<MediaType>> & {
  displayName?: string;
};
