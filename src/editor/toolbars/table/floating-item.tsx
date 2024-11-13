import { FC, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FloatingItemProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  children: ReactNode;
  className?: string;
  danger?: boolean;
}

const FloatingItem: FC<FloatingItemProps> = (props) => {
  const { onClick, active, children, className, danger } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md w-full transition-colors text-left text-sm",
        !danger && "hover:bg-gray-100 dark:hover:bg-gray-800",
        active && "bg-gray-100 dark:bg-gray-800 text-primary",
        danger && "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50",
        className
      )}
    >
      {children}
    </button>
  )
};

export default FloatingItem;
