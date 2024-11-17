import { ComponentPropsWithoutRef, FC, PropsWithChildren, ReactNode } from "react";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

type BaseTooltipProps = ComponentPropsWithoutRef<typeof TooltipContent>;

export interface TooltipProps {
  asChild?: boolean;
  side?: BaseTooltipProps["side"];
  align?: BaseTooltipProps["align"];
  alignOffset?: BaseTooltipProps["alignOffset"];
  sideOffset?: BaseTooltipProps["sideOffset"];
  className?: BaseTooltipProps["className"];
  content: ReactNode;
  withoutTag?: boolean;
  tagClassName?: string;
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = (props) => {
  const { asChild = true, children, className, content, withoutTag, tagClassName, ...rest } = props;

  return (
    <ShadcnTooltip>
      <TooltipTrigger asChild={asChild}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        {...rest}
        className={cn("bg-gray-800 backdrop-blur-md border-gray-700", className)}
      >
        {withoutTag ? content : <p className={cn("text-xs", tagClassName)}>{content}</p>}
      </TooltipContent>
    </ShadcnTooltip>
  );
};
