import { FC, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import FAB from "@blogcode/editor/toolbars/common/fab";
import IconPlus from "@blogcode/editor/icons/icon-plus";
import IconMinus from "@blogcode/editor/icons/icon-minus";

export interface CollapseProps {
  collapsed: boolean;
  onClick?(e: MouseEvent<HTMLButtonElement>): void;
}

const Collapse: FC<CollapseProps> = (props) => {
  const { collapsed, onClick } = props;

  return (
    <FAB
      icon={collapsed ? IconPlus : IconMinus}
      className={cn("transition-all", { "rotate-180": collapsed })}
      title="Collapse"
      onClick={onClick}
    />
  );
};

Collapse.displayName = "@blogcode/editor/table/Collapse";
export default Collapse;