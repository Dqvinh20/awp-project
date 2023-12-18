/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-lines-per-function */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  App,
  Button,
  Input,
  InputRef,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tooltip,
} from 'antd';

import { useParams } from 'react-router';

import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import { AnyObject } from 'antd/es/_util/type';

import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

import { differenceWith, isEqual } from 'lodash';

import { useQueryClient } from '@tanstack/react-query';

import ImportGradeButton from '../../button/ImportGradeButton';

import ExportGradeBoard from '../../button/ExportGradeBoard';

import ImportOneColumnButton from '../../button/ImportOneColumnButton';

import { ColumnTypes, GradeTableDataType, TableColumn } from './interfaces';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';

import {
  GradeColumn,
  GradeRow,
} from '@/app/store/server/features/class_grade/interfaces';
import {
  useRemoveGradeRow,
  useUpdateGradeRows,
} from '@/app/store/server/features/class_grade/mutations';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { calcFinalGrade } from '@/utils/index';

const mapData = (
  data: GradeRow[],
  columns: GradeColumn[]
): GradeTableDataType[] =>
  data?.map((row) => {
    const newGrade = {
      id: row.id ?? undefined,
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
  }) as GradeTableDataType[];

export interface GradeTableProps {
  isLoading: boolean;
  isTeacher: boolean;
  rows: GradeRow[];
  columns: GradeColumn[];
}

type DataIndex = keyof GradeTableDataType;

function GradeTable({
  rows = [],
  columns = [],
  isLoading,
  isTeacher = true,
}: GradeTableProps) {
  const data = useMemo(() => mapData(rows, columns), [rows, columns]);
  const [dataSource, setDataSource] = useState<GradeTableDataType[]>(data);
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { id: classId } = useParams<{ id: string }>();
  const userRole = useUserRole();
  const {
    mutate: removeGradeRowMutate,
    mutateAsync: removeGradeRowMutateAsync,
    isPending: isRemovingRow,
    variables,
  } = useRemoveGradeRow();

  const { mutate: updateGradeRowsMutate, isPending: isUpdatingRows } =
    useUpdateGradeRows();

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  // Row and cell editing
  // --------------------------------------------------
  const handleAddRow = () => {
    const newData: GradeTableDataType = {
      student_id: '',
      full_name: '',
      key: '',
    };

    columns
      .map((col) => col.name)
      .forEach((col) => {
        newData[col] = 0;
      });

    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: React.Key, id?: string) => {
    if (id && classId) {
      removeGradeRowMutate(
        { classId, rowId: id },
        {
          onSuccess() {
            message.success('Delete row successfully');
            const newData = dataSource.filter((item) => item.key !== key);
            setDataSource(newData);

            return queryClient.invalidateQueries({
              queryKey: ['class-grades', classId],
              exact: true,
            });
          },
          onError() {
            return message.error('Failed to delete grade row');
          },
        }
      );
      return;
    }
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleDeleteSelectedRows = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    if (classId) {
      try {
        await Promise.allSettled(
          selectedRows.map(async ({ id }) => {
            if (id) {
              await removeGradeRowMutateAsync({ classId, rowId: id });
            }
          })
        );

        const selectedKeys = selectedRows.map((item) => item.key);
        const newData = dataSource.filter(
          (item) => !selectedKeys.includes(item.key)
        );
        setDataSource(newData);
        setSelectedRows([]);

        message.success('Delete rows successfully');
        return queryClient.invalidateQueries({
          queryKey: ['class-grades', classId],
          exact: true,
        });
      } catch (error) {
        return message.error('Failed to delete grade rows');
      }
    }
  };

  const handleCellSave = (row: GradeTableDataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
      key: row.student_id,
    });
    setDataSource(newData);
  };

  const handleUpdateGrades = () => {
    const tempData = [...dataSource];
    const normalizeData: any = tempData.map(
      (item: Partial<GradeTableDataType>) => {
        const newItem = { ...item };
        delete newItem.key;
        return newItem;
      }
    );

    if (classId) {
      updateGradeRowsMutate(
        { classId, grade_rows: normalizeData },
        {
          onSuccess() {
            message.success('Grades updated successfully');
            return queryClient.invalidateQueries({
              queryKey: ['class-grades', classId],
              exact: true,
            });
          },
          onError() {
            return message.error('Failed to update grades');
          },
        }
      );
    }
  };

  // --------------------------------------------------

  // Filter search
  // --------------------------------------------------
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex>('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    isTeacher: boolean,
    render: (text: string) => React.ReactNode = (text) => text
  ): ColumnType<GradeTableDataType> => {
    const colProps: ColumnType<GradeTableDataType> = {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined
          className="!mr-1"
          style={{
            color: filtered ? '#1677ff' : undefined,
            fontSize: 16,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange(visible) {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render(text) {
        if (searchedColumn === dataIndex && isTeacher) {
          return (
            <Tooltip title={text} placement="bottom">
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
            </Tooltip>
          );
        }
        if (text.toString()) {
          return (
            <span className="text-slate-950 outline-none">
              {text.toString()}
            </span>
          );
        }
        return (
          <span className="text-red-700 outline-none">Click here to input</span>
        );
      },
    };

    return isTeacher
      ? colProps
      : {
          render,
        };
  };
  // --------------------------------------------------

  // Table columns
  // --------------------------------------------------
  const generateColumns = (gradeColumns: GradeColumn[]): TableColumn[] => {
    const defaultColumns: TableColumn[] = [
      {
        align: 'center',
        title: () => <div className="text-center text-xs">Student ID</div>,
        dataIndex: 'student_id',
        width: gradeColumns && gradeColumns.length === 0 ? '14%' : '12%',
        fixed: 'left',
        responsive: ['md'],
        defaultSortOrder: 'ascend',
        editable: isTeacher,
        inputName: 'Student ID',
        type: 'string',
        ...(getColumnSearchProps('student_id', isTeacher, (text: string) => (
          <div>
            <Tooltip title={text} placement="bottom">
              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {text}
              </div>
            </Tooltip>
          </div>
        )) as any),
        sorter: isTeacher
          ? (a, b) => Number(a.student_id) - Number(b.student_id)
          : undefined,
        onCell: () => ({
          className: 'text-sm text-center mx-0',
          rules: [
            {
              required: true,
              message: 'Student ID is required.',
            },
            {
              pattern: /^[0-9]+$/,
              message: 'Student ID must be a number.',
            },
            ({ getFieldsValue }: { getFieldsValue: any }) => ({
              validator(_: any, value: any) {
                if (value === '') {
                  return Promise.resolve();
                }

                if (value && isNaN(value)) {
                  return Promise.reject(
                    new Error('Student ID has to be a number.')
                  );
                }

                if (value <= 0) {
                  return Promise.reject(new Error('Invalid Student ID.'));
                }

                if (value.toString().length > 10) {
                  return Promise.reject(
                    new Error("Student ID can't be more than 10 characters.")
                  );
                }

                // Get row data from form
                const allFieldValues = getFieldsValue(true);
                const rowKey = dataSource.find(
                  (item) => item.key === allFieldValues.key
                )?.key;

                // Check unique student id
                if (
                  dataSource.some(
                    (item) => item.key !== rowKey && item.student_id === value
                  )
                ) {
                  return Promise.reject(
                    new Error('Student ID has to be unique.')
                  );
                }

                return Promise.resolve();
              },
            }),
          ],
        }),
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        width: gradeColumns && gradeColumns.length === 0 ? '40%' : '16%',
        fixed: 'left',
        ellipsis: true,
        editable: isTeacher,
        inputName: 'Full Name',
        type: 'string',
        ...(getColumnSearchProps('full_name', isTeacher, (text: string) => (
          <div>
            <Tooltip title={text} placement="bottom">
              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {text}
              </div>
            </Tooltip>
          </div>
        )) as any),
        sorter: isTeacher
          ? (a, b) => a.full_name.localeCompare(b.full_name)
          : undefined,
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 200,
          },
          className: `text-sm hover:bg-[#fafafa]`,
          rules: [
            {
              required: true,
              message: 'Full Name is required.',
            },
          ],
        }),
      },
    ];
    const restCols = () => {
      if (!gradeColumns || gradeColumns.length === 0) {
        return [
          {
            title: 'No Grade Columns',
            align: 'center',
          },
        ] as TableColumn[];
      }

      return gradeColumns.map(
        (col): TableColumn =>
          ({
            title: (
              <div>
                <div>{col.name}</div>
                <div className="text-xs text-gray-500">{col.scaleValue}%</div>
              </div>
            ),
            dataIndex: col.name,
            inputName: col.name,
            key: col.name,
            editable: isTeacher,
            type: 'number',
            align: 'center',
            sorter: isTeacher
              ? (a, b) => Number(a[col.name]) - Number(b[col.name])
              : undefined,
            filtered: true,
            onCell: () => ({
              rules: [
                {
                  required: true,
                  message: `${col.name} is required.`,
                },
                () => ({
                  validator(_: any, value: any) {
                    if (value === 0) {
                      return Promise.resolve();
                    }

                    if (isNaN(value)) {
                      return Promise.reject(
                        new Error('Grade has to be a number.')
                      );
                    }
                    if (value < 0) {
                      return Promise.reject(
                        new Error("Grade can't be less than 0")
                      );
                    }
                    if (value > 10) {
                      return Promise.reject(
                        new Error("Grade can't be more than 10")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ],
            }),
          } as TableColumn)
      );
    };

    const result = [...defaultColumns, ...restCols()];
    if (dataSource.length >= 1 && columns.length >= 1 && isTeacher) {
      result.push({
        title: '',
        dataIndex: 'operation',
        width: '1%',
        fixed: 'right',
        render(_: any, record: { key: React.Key; id?: string }) {
          if (isRemovingRow && variables.rowId === record.id) {
            return <LoadingOutlined />;
          }

          if (
            dataSource.length >= 1 &&
            data.map((item) => item.student_id).includes(record.key as string)
          ) {
            return (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key, record.id)}
                placement="bottomRight"
              >
                <Tooltip title="Delete" placement="bottom">
                  <DeleteOutlined className="hover:text-red-500" />
                </Tooltip>
              </Popconfirm>
            );
          }

          return (
            <Tooltip title="Delete" placement="bottom">
              <DeleteOutlined
                onClick={() => handleDelete(record.key)}
                className="hover:text-red-500"
              />
            </Tooltip>
          );
        },
      } as unknown as TableColumn);
    }
    return result;
  };

  const tableColumns = useMemo(
    () =>
      generateColumns(columns).map((col) => {
        if (!col.editable) {
          return col;
        }
        const cellProps = col.onCell ? col.onCell({}) : {};
        return {
          ...col,
          onCell: (record: GradeTableDataType) => ({
            record,
            editable: col.editable,
            type: col.type,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleCellSave,
            ...cellProps,
          }),
        };
      }),
    [handleCellSave]
  );
  // --------------------------------------------------

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const onSelectChange = (newSelectedRowKeys: any, newSelectedRows: any) => {
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map((item) => item.key),
    onChange: onSelectChange,
  };

  const tableProps: TableProps<AnyObject> = isTeacher
    ? {
        rowSelection: { rowSelection } as any,
        pagination: {
          hideOnSinglePage: true,
          position: ['bottomRight'],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total: any, range: any) =>
            `${range[0]}-${range[1]} of ${total} items`,
          showPrevNextJumpers: true,
        },
        onRow: (record) =>
          ({
            initialValues: record,
          } as any),
      }
    : {
        pagination: false,
      };

  // if (!rows || !columns) {
  //   return (
  //     <div className="flex justify-center items-center h-[400px]">
  //       <div className="text-center">
  //         <div className="text-2xl font-semibold">No grade existed</div>
  //         <div className="text-sm text-gray-500"></div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (rows.length === 0 && columns.length === 0) {
  //   return (
  //     <div className="flex justify-center items-center h-[400px]">
  //       <div className="text-center">
  //         <div className="text-2xl font-semibold">No grade columns</div>
  //         <div className="text-sm text-gray-500">
  //           Please add grade columns to view grades
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const isSaveButtonDisabled = () => {
    if (dataSource.length === 0) {
      return true;
    }

    if (dataSource.some((item) => item.key === '')) {
      return true;
    }

    const dif = differenceWith(dataSource, data, isEqual);
    if (dif.length === 0) {
      return true;
    }

    if (
      dataSource[dataSource.length - 1].full_name === '' ||
      dataSource[dataSource.length - 1].student_id === ''
    ) {
      return true;
    }
  };

  const hasSelected = selectedRows.length > 0;

  return (
    <>
      {userRole === USER_ROLE.Teacher && (
        <div className="flex justify-end items-center gap-x-4 mb-4">
          {hasSelected && (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={handleDeleteSelectedRows}
              placement="bottomRight"
            >
              <Button
                loading={isRemovingRow}
                type="primary"
                className="bg-red-500 hover:!bg-red-500/70"
              >
                Delete rows
              </Button>
            </Popconfirm>
          )}
          <ImportOneColumnButton columns={columns} />
          <ImportGradeButton />
          <ExportGradeBoard className="bg-green-500 hover:!bg-green-500 hover:opacity-[.8] hover:!drop-shadow-lg" />
        </div>
      )}
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
        summary={() =>
          dataSource.length !== 0 &&
          columns.length !== 0 &&
          isTeacher && (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <div className="flex justify-center items-center">
                  <div className="text-sm font-semibold">Average</div>
                </div>
              </Table.Summary.Cell>
              {columns.map((col) => (
                <Table.Summary.Cell
                  index={col.ordinal + 1}
                  key={col.id}
                  colSpan={1}
                >
                  <div className="flex justify-center items-center">
                    <div className="text-sm font-semibold">
                      {parseFloat(
                        (
                          dataSource.reduce(
                            (acc, curr) => acc + (Number(curr[col.name]) ?? 0),
                            0
                          ) / dataSource.length
                        ).toFixed(2)
                      )}
                    </div>
                  </div>
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          )
        }
      />
      {userRole === USER_ROLE.Teacher && (
        <div className="flex justify-end items-center gap-x-4 mt-4">
          <Button
            disabled={isLoading || (dataSource && dataSource[0]?.key === '')}
            onClick={handleAddRow}
            type="primary"
          >
            Add a row
          </Button>
          <Button
            loading={isUpdatingRows}
            disabled={isLoading || isSaveButtonDisabled()}
            type="primary"
            onClick={handleUpdateGrades}
          >
            Save
          </Button>
        </div>
      )}
      {userRole === USER_ROLE.Student && (
        <div className="my-4 flex flex-col flex-end">
          <span className="text-base font-medium text-right">
            Final Grade:{' '}
            {parseFloat(
              calcFinalGrade(dataSource, columns)[0].finalGrade.toFixed(2)
            )}
          </span>
        </div>
      )}
    </>
  );
}

export default memo(GradeTable);
