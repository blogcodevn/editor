import { cn } from "@/lib/utils";
import { ComponentProps, ComponentType } from "react";

const totalItems = 6;

type PropsWithCollapse<Props> = Props & {
  collapsed: boolean;
  index: number;
};

export function withCollapse<Props>(
  Component: ComponentType<Props>
): ComponentType<PropsWithCollapse<Props>> {
  return function WithCollapse(props) {
    const { collapsed, index, ...rest } = props;
    type PropsOfComponnent = JSX.IntrinsicAttributes &  ComponentProps<typeof Component>;

    return (
      <div
        className={cn(
          "inline-block p-0 transition-[margin-right]",
          collapsed ? "-mr-5" : "mr-0",
          { "pointer-events-none": collapsed }
        )}
        style={{
          transitionDuration: "50ms",
          transitionDelay: collapsed ? `${(index - 1) * 50}ms` : `${(totalItems - index) * 50}ms`,
        }}
      >
        <Component {...(rest as PropsOfComponnent)} />
      </div>
    );
  }
}
