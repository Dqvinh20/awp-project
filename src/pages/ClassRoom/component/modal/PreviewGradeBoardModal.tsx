/* eslint-disable max-lines-per-function */
import { useMemo, useState } from 'react';
import { App, Modal, Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { useParams } from 'react-router-dom';

import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';
import ClassGradeService from '@/services/ClassGradeService';

interface PreviewGradeBoardDataType {
  key: string;
  student_id: string;
  full_name: string;

  [key: string]: string;
}

interface PreviewGradeBoardModalProps
  extends Omit<TableProps<PreviewGradeBoardDataType>, 'columns'> {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  onSuccess: () => void;
  gradeColumns?: GradeColumn[];
  file: File | null;
}

function PreviewGradeBoardModal({
  open,
  setOpen,
  onCancel,
  dataSource = [],
  gradeColumns = [],
  file,
  onSuccess = () => {
    /* */
  },
  ...props
}: PreviewGradeBoardModalProps) {
  const { id: classId } = useParams();
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();
  const columns = useMemo(
    () =>
      [
        {
          title: 'Ordinal',
          dataIndex: 'key',
          rowScope: 'row',
          align: 'center',
          width: '3%',
        },
        {
          title: 'Student ID',
          dataIndex: 'student_id',
          key: 'student',
          align: 'center',
          width: '12%',
        },
        {
          title: 'Full Name',
          dataIndex: 'full_name',
          key: 'full_name',
        },
        ...gradeColumns.map((column) => ({
          title: column.name,
          dataIndex: column.name,
          key: column.id,
        })),
      ] as ColumnsType<PreviewGradeBoardDataType>,
    [gradeColumns]
  );

  const data: PreviewGradeBoardDataType[] = useMemo(
    () =>
      dataSource.map((row: PreviewGradeBoardDataType, index) => ({
        ...row,
        key: String(index + 1),
      })),
    [dataSource]
  );

  if (!classId) {
    throw new Error('Class ID is required');
  }

  if (!file) {
    throw new Error('File is required');
  }

  const handleImportData = () => {
    setLoading(true);

    ClassGradeService.importGradeBoard({
      classId,
      file,
    })
      .then(async (res) => {
        await onSuccess();
        notification.success({
          message: 'Import Grade Success',
          description: 'Grade table has been imported successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Import Grade Error',
          description: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      centered
      className="!w-[80%] top-10"
      open={open}
      okText="Import"
      onCancel={() => {
        onCancel();
        setOpen(false);
      }}
      onOk={handleImportData}
      confirmLoading={loading}
    >
      <div className="flex items-center justify-center">
        <p className="text-2xl font-medium">Preview Grade Board</p>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        bordered
        {...props}
        pagination={{
          showQuickJumper: true,
          showTotal(total, range) {
            return `${range[0]}-${range[1]} of ${total} items`;
          },
          showLessItems: true,
        }}
      />
    </Modal>
  );
}

export default PreviewGradeBoardModal;
