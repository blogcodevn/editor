import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export interface GroupProps {
  className?: string;
};

const Group: FC<PropsWithChildren<GroupProps>> = (props) => {
  const { className, children } = props;

  return (
    <div className={cn("flex items-center gap-[1px]", className)}>
      {children}
    </div>
  );
};

Group.displayName = "@blogcode/editor/Group";
export default Group;
