import { FC } from 'react';
import { Editor } from '@tiptap/react';
import { Table as TableIcon } from 'lucide-react';
import "./table.css";

export interface TableGroupProps {
  editor: Editor;
}

const TableGroup: FC<TableGroupProps> = (props) => {
  const { editor } = props;

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  };

  return (
    <button
      type="button"
      onClick={insertTable}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <TableIcon className="w-4 h-4" />
    </button>
  );
};

export default TableGroup;
