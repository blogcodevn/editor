import { FC, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Alignment from "./alignment";
import NewLine from "./new-line";
import Remove from "./remove";
import FullWidth from "./full-width";
import Rows from "./rows";
import Columns from "./columns";
import Collapse from "./collapse";

export interface TableFloatingProps {
  wrapper: HTMLDivElement;
  editor: Editor;
  updatePosition(): void;
}

const TableFloating: FC<TableFloatingProps> = (props) => {
  const { wrapper, editor, updatePosition } = props;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    updatePosition();
  }, [wrapper, updatePosition]);

  const handleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <TooltipProvider>
      <Alignment editor={editor} collapsed={collapsed} index={1} />
      <FullWidth editor={editor} collapsed={collapsed} index={2} />
      <Rows editor={editor} collapsed={collapsed} index={3} />
      <Columns editor={editor} collapsed={collapsed} index={4} />
      <NewLine wrapper={wrapper} collapsed={collapsed} index={5} />
      <Remove editor={editor} collapsed={collapsed} index={6} />
      <Collapse collapsed={collapsed} onClick={handleCollapse} />
    </TooltipProvider>
  );
};

export default TableFloating;
