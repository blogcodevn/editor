import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import Table from './table';

const TableExtensions = [
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'border-collapse border border-gray-200 dark:border-gray-700',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'border-b border-gray-200 dark:border-gray-700',
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: 'border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-semibold p-2',
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: 'border border-gray-200 dark:border-gray-700 p-2',
    },
  }),
];

export default TableExtensions;
