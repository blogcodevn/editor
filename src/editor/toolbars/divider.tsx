import { FC } from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
}

const Divider: FC<DividerProps> = (props) => {
  const { className } = props;

  return (
    <div className={cn("w-px h-4 bg-gray-200 dark:bg-gray-700 mx-2", className)} />
  );
};

Divider.displayName = "@blogcode/editor/Divider";
export default Divider;
