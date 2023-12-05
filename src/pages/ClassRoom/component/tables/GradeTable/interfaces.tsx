import Table from 'antd/es/table';

export interface Item {
  key: string;
  name: string;
  [key: string]: any;
}

export interface DataType {
  key: React.Key;
  student_id: string;
  full_name: string;
  [key: string]: any;
}

export type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export type TableColumn = ColumnTypes[number] & {
  editable?: boolean;
  dataIndex: string;
  type?: 'number' | 'string';
};
