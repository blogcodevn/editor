import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import Table from './table';

const TableExtensions = [
  Table.configure({
    resizable: true,
    HTMLAttributes: {},
  }),
  TableRow.configure({
    HTMLAttributes: {},
  }),
  TableHeader.configure({
    HTMLAttributes: {},
  }),
  TableCell.configure({
    HTMLAttributes: {},
  }),
];

export default TableExtensions;
