import { MouseEvent } from "react";
import { Editor } from "@tiptap/react";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";

export type ToolbarButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;

export type PropsWithEditor<Props = object> = Props & {
  editor: Editor | null;
};

export interface GroupPropsInterface<Type, Icons = Record<string, SvgIcon>> {
  exclude?: Type[];
  className?: string;
  btnClassName?: string;
  icons?: Icons;
}

export type CommonGroupProps<Type, Icons = Record<string, SvgIcon> | undefined> =
  PropsWithEditor<GroupPropsInterface<Type, Icons>>;

export type ControlSize = "sm" | "default" | "lg";

export type RoundedSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface MarkdownSerialize {
  toMarkdown(): string;
}
