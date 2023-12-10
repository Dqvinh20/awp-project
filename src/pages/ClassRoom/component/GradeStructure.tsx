/* eslint-disable max-lines-per-function */
import {
  DragEndEvent,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useEffect, useState } from 'react';
import { App, Button, Popconfirm, Spin, Table, Typography } from 'antd';
import { Rule } from 'antd/es/form';

import { CloseOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import EditableCell from './tables/GradeStructure/EditableCell';
import EditableRow, {
  EditableRowProps,
} from './tables/GradeStructure/EditableRow';

import './tables/GradeStructure/index.css';

import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';
import { useUpdateGradeColumns } from '@/app/store/server/features/class_grade/mutations';
import ErrorPage from '@/pages/ErrorPage';

const { Text } = Typography;

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  id?: string;
  key: React.Key;
  name: string;
  ordinal: number;
  scaleValue: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

export default function GradeStructure() {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    data: grade_columns,
    isLoading,
    isError,
    isSuccess,
    error: fetchDataError,
  } = useGetClassGrades(id, (grade) => grade.grade_columns);
  const [editing, setEditing] = useState(false);
  const [currPercent, setCurrPercent] = useState(0);
  const updateGradeColumns = useUpdateGradeColumns();

  useEffect(() => {
    if (grade_columns && grade_columns.length !== 0) {
      setCurrPercent(() =>
        grade_columns?.reduce(
          (acc: number, cur: GradeColumn) => acc + cur.scaleValue,
          0
        )
      );
      setDataSource(() =>
        grade_columns?.map((item: GradeColumn) => ({
          key: (item.ordinal as number) + 1,
          id: item.id,
          name: item.name,
          ordinal: item.ordinal,
          scaleValue: item.scaleValue,
        }))
      );
    }
  }, [grade_columns]);

  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const handleUpdateGradeColumns = () => {
    const submitData = dataSource.map((dataRow) => ({
      id: dataRow.id,
      name: dataRow.name,
      ordinal: dataRow.ordinal,
      scaleValue: dataRow.scaleValue,
    }));
    submitData.forEach((dataRow: any) => {
      Object.keys(dataRow).forEach(
        (key) => dataRow[key] === undefined && delete dataRow[key]
      );
    });
    updateGradeColumns.mutate(
      {
        class_id: id!,
        grade_columns: submitData,
      },
      {
        onSuccess() {
          setEditing(false);
          notification.success({
            message: 'Success',
            description: 'Grade structure has been updated.',
          });
          return queryClient.invalidateQueries({
            queryKey: ['class-grades', id],
          });
        },
        onError() {
          return notification.error({
            message: 'Error',
            description: 'Something went wrong. Please try again later.',
          });
        },
      }
    );
  };

  const columnGenerator = () => {
    const defaultColumns: (ColumnTypes[number] & {
      editable?: boolean;
      dataIndex: string;
    })[] = [
      { dataIndex: 'sort', width: '5%' },
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: 'Percent %',
        dataIndex: 'scaleValue',
        editable: true,
      },
      {
        dataIndex: 'operation',
        width: '5%',
        render(_, record) {
          if (dataSource.length >= 1 && record?.id && record?.id !== '') {
            return (
              <Popconfirm
                title="Sure to delete?. All grade data will be deleted."
                onConfirm={() => handleRowDelete(record.key)}
                placement="bottom"
              >
                <CloseOutlined className="text-red-500 [&_svg]:scale-[120%]" />
              </Popconfirm>
            );
          }

          return dataSource.length >= 1 ? (
            <CloseOutlined
              onClick={() => handleRowDelete(record.key)}
              className="text-red-500 [&_svg]:scale-[120%]"
            />
          ) : null;
        },
      },
    ];

    return defaultColumns.map((col) => {
      if (!col.editable) {
        return col;
      }

      // Edit rule
      const rules: Rule[] = [];
      if (col.dataIndex === 'name') {
        rules.push(({ getFieldsValue }) => ({
          transform: (value) => value.trim(),
          validator(_, value) {
            if (!value) {
              return Promise.resolve();
            }
            const data = getFieldsValue(true);
            const isDuplicate = dataSource.some(
              (item) => item.name === value && item.ordinal !== data.ordinal
            );
            if (isDuplicate) {
              return Promise.reject(new Error('Name is duplicated'));
            }
            return Promise.resolve();
          },
        }));
      }

      if (col.dataIndex === 'scaleValue') {
        rules.push(({ getFieldsValue }) => ({
          transform: (value) => value.trim(),
          validator(_, value) {
            if (!value) {
              return Promise.resolve();
            }

            if (isNaN(Number(value))) {
              return Promise.reject(new Error('Value must be a number'));
            }

            const number = Number(value);

            if (number < 0) {
              return Promise.reject(new Error('Value must be greater than 0'));
            }

            if (number > 100) {
              return Promise.reject(new Error('Value must be less than 100'));
            }

            const data = getFieldsValue(true);
            const currentPercent =
              dataSource
                .filter((item) => item.ordinal !== data.ordinal)
                .reduce((acc, cur) => acc + cur.scaleValue, 0) + Number(value);
            setCurrPercent(currentPercent);

            return Promise.resolve();
          },
        }));
      }

      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleCellSave,
          rules,
          suffix: col.dataIndex === 'scaleValue' && '%',
        }),
      };
    });
  };

  // Table edit handler
  // ---------------------------
  const handleRowDelete = (key: React.Key) => {
    const deletedItemIndex = dataSource.findIndex((item) => item.key === key);
    for (let i = deletedItemIndex; i < dataSource.length; i += 1) {
      dataSource[i].ordinal -= 1;
    }

    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    setCurrPercent(newData.reduce((acc, cur) => acc + cur.scaleValue, 0));
    setEditing(true);
  };

  const handleCellSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    if (
      row.scaleValue !== item.scaleValue ||
      row.ordinal !== item.ordinal ||
      row.name !== item.name
    ) {
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
      setEditing(true);
    }
  };

  const handleAddRow = () => {
    const key =
      dataSource.length === 0
        ? 1
        : Math.max(...dataSource.map((i) => i.key as number)) + 1;
    const ordinal =
      dataSource.length === 0
        ? 1
        : Math.max(...dataSource.map((i) => i.ordinal)) + 1;
    const newData: any = {
      key,
      name: ``,
      scaleValue: 0,
      ordinal,
    };
    setDataSource([...dataSource, newData]);
    setEditing(true);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);

        // Swap ordinal
        const overOrdinal = previous[overIndex].ordinal;
        previous[overIndex].ordinal = previous[activeIndex].ordinal;
        previous[activeIndex].ordinal = overOrdinal;

        return arrayMove(previous, activeIndex, overIndex);
      });
      setEditing(true);
    }
  };
  // ---------------------------

  // Drag and drop hooks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const isSaveButtonDisabled = () => {
    if (dataSource.length === 0 || currPercent !== 100 || !editing) {
      return true;
    }

    return dataSource.some((item) => item.name === '');
  };

  const renderError = () => {
    if (
      fetchDataError instanceof AxiosError &&
      fetchDataError?.response?.data.message ===
        'You are not allowed to view this class grade'
    ) {
      return (
        <div className="twp text-center flex items-center justify-center h-full">
          <p className="text-xl font-medium">
            Teacher is not finished with the grade
          </p>
        </div>
      );
    }

    return isError && <ErrorPage error={fetchDataError} />;
  };

  return (
    <div className="min-h-full h-full p-4 pb-12">
      {isSuccess && (
        <>
          <div className="flex justify-end gap-x-4 mb-4">
            <Button disabled={isLoading} onClick={handleAddRow} type="primary">
              Add a row
            </Button>
            <Button
              loading={updateGradeColumns.isPending}
              disabled={isLoading || isSaveButtonDisabled()}
              type="primary"
              onClick={handleUpdateGradeColumns}
            >
              Save
            </Button>
          </div>
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={dataSource.map((i) => i.key as number)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                loading={isLoading}
                className="w-full rounded-sm border border-solid border-gray-300"
                rowKey="key"
                showHeader
                pagination={false}
                components={components}
                rowClassName={() => 'editable-row'}
                dataSource={dataSource}
                columns={columnGenerator() as ColumnTypes}
                onRow={(record) =>
                  ({
                    initialValues: record,
                  } as EditableRowProps)
                }
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      Total percentage:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text type={currPercent !== 100 ? 'danger' : 'success'}>
                        {currPercent}%
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </SortableContext>
          </DndContext>
        </>
      )}
      {isLoading && (
        <div className="h-full flex items-center justify-center">
          <Spin />
        </div>
      )}
      {isError && renderError()}
    </div>
  );
}
