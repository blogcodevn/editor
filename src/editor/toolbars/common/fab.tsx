import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const fabClasses = cva(
  "relative flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-opacity-0",
  {
    variants: {
      color: {
        success: "bg-green-400 text-green-400 hover:bg-green-500/40",
        danger: "bg-red-400 text-red-400 hover:bg-red-500/40",
        warning: "bg-yellow-400 text-yellow-400 hover:bg-yellow-500/40",
        info: "bg-blue-400 text-blue-400 hover:bg-blue-500/40",
        white: "bg-white text-gray-300 hover:bg-gray-100/40",
      },
      size: {
        sm: "w-5 h-5",
        md: "w-8 h-8",
        lg: "w-10 h-10",
      }
    },
    defaultVariants: {
      color: "white",
      size: "md",
    },
  }
);

const iconSize = {
  sm: 12,
  md: 16,
  lg: 20,
};

type FABVariant = VariantProps<typeof fabClasses>;

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "color">;

export interface FABProps extends BaseButtonProps {
  color?: FABVariant["color"];
  size?: FABVariant["size"];
  icon: SvgIcon;
  title?: string;
}

const FAB = forwardRef<HTMLButtonElement, FABProps>(
  function FAB(props, ref) {
    const { color = "white", size = "sm", icon: Icon, className, title, ...rest } = props;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            {...rest}
            ref={ref}
            type="button"
            className={cn(fabClasses({ color, size }), className)}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "backdrop-blur-md bg-opacity-20 rounded-full",
                  fabClasses({ color, size }),
                )}
                style={{
                  width: iconSize[size ?? "sm"] + "px",
                  height: iconSize[size ?? "sm"] + "px",
                }}
              />
            </span>
            <span className="relative">
              <Icon size={iconSize[size ?? "sm"]} />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent className={cn("bg-gray-800 backdrop-blur-md border-gray-700")}>
          <p className="text-xs">{title}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

FAB.displayName = "@blogcode/editor/FAB";
export default FAB;
