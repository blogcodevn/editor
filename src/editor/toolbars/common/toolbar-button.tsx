import { forwardRef, PropsWithChildren } from "react";
import { ToolbarButtonClickHandler } from "@blogcode/editor/types";
import { SvgIcon } from "@blogcode/editor/icons/svg-icon";
import { cn } from "@/lib/utils";

export interface ToolbarButtonProps {
  className?: string;
  active: boolean;
  Icon: SvgIcon;
  iconSise?: number;
  onClick?: ToolbarButtonClickHandler;
}

const ToolbarButton = forwardRef<HTMLButtonElement, PropsWithChildren<ToolbarButtonProps>>(
  function ToolbarButton(props, ref) {
    const { active, Icon, onClick, className, iconSise, children } = props;
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          "p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
          active ? "bg-gray-100 dark:bg-gray-800" : "",
          className
        )}
      >
        <Icon size={iconSise} className="w-4 h-4" />
        {children}
      </button>
    );
  }
);

ToolbarButton.displayName = "@blogcode/editor/ToolbarButton";
export default ToolbarButton;
