/* eslint-disable max-lines-per-function */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Popconfirm, Table, TableProps, Tooltip, theme } from 'antd';

import { useParams } from 'react-router';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { AnyObject } from 'antd/es/_util/type';

import { ColumnTypes, DataType, TableColumn } from './interfaces';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';

import {
  GradeColumn,
  GradeRow,
} from '@/app/store/server/features/class_grade/interfaces';
import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';

const gradeCols: GradeColumn[] = [
  {
    name: 'Exercises',
    ordinal: 0,
    scaleValue: 12,
  },
  {
    name: 'Exercises 2',
    ordinal: 0,
    scaleValue: 12,
  },
  {
    name: 'Exercises 3',
    ordinal: 0,
    scaleValue: 12,
  },
];

// const gradeCols: GradeColumn[] = [];

const sampleData: DataType[] = [
  {
    key: '0',
    student_id: '20127665',
    full_name: 'Edward King 0',
  },
  {
    key: '1',
    student_id: '20127638',
    full_name: 'Edward King 1asdasdas asdads dasdasd',
  },
];

const mapData = (data: GradeRow[], columns: GradeColumn[]): DataType[] =>
  data.map((row) => {
    const newGrade = {
      key: row.student_id,
      student_id: row.student_id,
      full_name: row.full_name,
    } as { [key: string]: any };

    row.grades.forEach((grade) => {
      const column = columns.find((col) => col.id === grade.column)?.name;
      if (column) {
        newGrade[column] = grade.value;
      }
    });
    return newGrade;
  }) as DataType[];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GradeTableProps {
  isLoading: boolean;
  isTeacher: boolean;
  rows: GradeRow[];
  columns: GradeColumn[];
}

// eslint-disable-next-line no-empty-pattern
function GradeTable({
  rows,
  columns,
  isLoading,
  isTeacher = true,
}: GradeTableProps) {
  const data = useMemo(() => mapData(rows, columns), [rows, columns]);
  const [dataSource, setDataSource] = useState<DataType[]>(data);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row: DataType) => {
    // Call API to update grade
    // Send row to API
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const generateColumns = (gradeColumns: GradeColumn[]): TableColumn[] => {
    const defaultColumns: TableColumn[] = [
      {
        align: 'center',
        title: () => <div className="text-center text-xs">Student ID</div>,
        dataIndex: 'student_id',
        width: gradeColumns.length === 0 ? '12%' : '10%',
        fixed: 'left',
        responsive: ['md'],
        defaultSortOrder: 'ascend',
        editable: false,
        type: 'string',
        sorter: (a, b) => Number(a.student_id) - Number(b.student_id),
        onCell: () => ({
          className: 'text-sm text-center mx-0',
        }),
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        width: gradeColumns.length === 0 ? '40%' : '16%',
        fixed: 'left',
        ellipsis: true,
        editable: false,
        type: 'string',
        sorter: (a, b) => a.full_name.localeCompare(b.full_name),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 200,
          },
          className: `text-sm hover:bg-[#fafafa]`,
        }),
        render(text) {
          return (
            <div>
              <Tooltip title={text} placement="bottom">
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {text}
                </div>
              </Tooltip>
            </div>
          );
        },
      },
    ];
    const restCols = () => {
      if (gradeColumns.length === 0) {
        return [
          {
            title: 'No Grade Columns',
            align: 'center',
          },
        ] as TableColumn[];
      }

      return gradeColumns.map(
        (col): TableColumn => ({
          title: col.name,
          dataIndex: col.name,
          key: col.name,
          editable: isTeacher,
          type: 'number',
          sorter: (a, b) => Number(a[col.name]) - Number(b[col.name]),
          filtered: true,
        })
      ) as TableColumn[];
    };

    const result = [...defaultColumns, ...restCols()];
    // if (dataSource.length >= 1 && isTeacher) {
    //   result.push({
    //     title: '',
    //     dataIndex: 'operation',
    //     width: '1%',
    //     render: (_: any, record: { key: React.Key }) =>
    //       dataSource.length >= 1 ? (
    //         <Popconfirm
    //           title="Sure to delete?"
    //           onConfirm={() => handleDelete(record.key)}
    //           placement="bottomRight"
    //         >
    //           <DeleteOutlined className="hover:text-red-500" />
    //         </Popconfirm>
    //       ) : null,
    //   } as unknown as TableColumn);
    // }
    return result;
  };

  const tableColumns = useMemo(
    () =>
      generateColumns(columns).map((col) => {
        if (!col.editable) {
          return col;
        }

        return {
          ...col,
          onCell: (record: DataType) => ({
            record,
            editable: col.editable,
            type: col.type,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      }),
    [handleSave]
  );

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const tableProps: TableProps<AnyObject> = isTeacher
    ? {
        title: () => 'Header',
        footer: () => 'Footer',
        pagination: {
          position: ['bottomRight'],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total: any, range: any) =>
            `${range[0]}-${range[1]} of ${total} items`,
          showPrevNextJumpers: true,
        },
      }
    : {
        pagination: false,
      };

  if (rows.length === 0 && columns.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="text-center">
          <div className="text-2xl font-semibold">No grade columns</div>
          <div className="text-sm text-gray-500">
            Please add grade columns to view grades
          </div>
        </div>
      </div>
    );
  }

  return (
    <Table
      size="middle"
      loading={isLoading}
      components={components}
      scroll={{ x: 'max-content' }}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={tableColumns as ColumnTypes}
      {...tableProps}
      //   summary={() => (
      //     <Table.Summary fixed={'bottom'}>
      //       <Table.Summary.Row>
      //         <Table.Summary.Cell index={0} colSpan={2}>
      //           <PlusOutlined />
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={2}>Scroll Context</Table.Summary.Cell>
      //       </Table.Summary.Row>
      //     </Table.Summary>
      //   )}
    />
  );
}

export default memo(GradeTable);
