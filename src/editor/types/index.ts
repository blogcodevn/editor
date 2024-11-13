import { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Editor } from "@tiptap/react";
import { LucideProps } from "lucide-react";

export type EditorIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

export type ToolbarButtonClickHandler = (e: MouseEvent<HTMLButtonElement>) => void;

export type PropsWithEditor<Props = object> = Props & {
  editor: Editor | null;
};

export interface GroupPropsInterface<Type, Icons = Record<string, EditorIcon>> {
  exclude?: Type[];
  className?: string;
  btnClassName?: string;
  icons?: Icons;
}

export type CommonGroupProps<Type, Icons = Record<string, EditorIcon> | undefined> =
  PropsWithEditor<GroupPropsInterface<Type, Icons>>;
