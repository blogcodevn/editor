import {
  ComponentPropsWithoutRef,
  createElement,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  ReactSVG,
  RefAttributes,
} from "react";

export interface SvgIconProps
  extends Partial<Omit<ComponentPropsWithoutRef<"svg">, "stroke">> {
  size?: string | number;
  stroke?: string | number;
  title?: string;
}

export type SvgIcon = FC<SvgIconProps>;
export type SvgIconComponent = ForwardRefExoticComponent<
  Omit<SvgIconProps, "ref"> & RefAttributes<SvgIcon>
>;

export type SvgIconNode = [
  elementName: keyof ReactSVG,
  attrs: Record<string, string>
][];

export const defaultAttributes = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
  },
};

export const createSvgIcon = (
  type: "filled" | "outline",
  iconName: string,
  displayName: string,
  iconNode: SvgIconNode
) => {
  const Component = forwardRef((props: SvgIconProps, ref) => {
    const {
      size = 24,
      stroke = 2,
      className,
      title,
      color = "currentColor",
      children,
      ...rest
    } = props;

    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes[type],
        width: size,
        height: size,
        className: ["SvgIcon-root", `SvgIcon-root-${iconName}`, className].join(
          " "
        ),
        ...(type === "filled"
          ? { fill: color }
          : {
              stroke: color,
              strokeWidth: stroke,
            }),
        ...rest,
      },
      [title && createElement("title", { key: "SvgIcon-title" }, title)],
      ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
      ...(Array.isArray(children) ? children : [children])
    );
  });

  Component.displayName = `@blogcode/editor/${displayName}`;
  return Component;
};
