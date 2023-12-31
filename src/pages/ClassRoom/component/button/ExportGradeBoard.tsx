import { ExportOutlined } from '@ant-design/icons';
import { Button, App } from 'antd';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { getFileNameFromContentDisposition } from '@/utils/index';
import ClassGradeService from '@/services/ClassGradeService';

function ExportGradeBoard({ className }: { className?: string }) {
  const { notification } = App.useApp();
  const { id: classId } = useParams();
  const [exportLoading, setExportLoading] = useState(false);
  if (!classId) {
    throw new Error('Class ID is required');
  }

  const exportGradeBoard = () => {
    if (classId) {
      setExportLoading(true);
      ClassGradeService.exportGradeBoard({ classId, file_type: 'xlsx' })
        .then((response) => {
          const contentDisposition = response.headers['content-disposition'];
          const fileName =
            getFileNameFromContentDisposition(contentDisposition);
          const blob = new Blob([response.data], {
            type: 'application/xlsx',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName ?? 'grade-board.xlsx');
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          notification.error({
            message: 'Export Error',
            description: error.message,
          });
        })
        .finally(() => {
          setExportLoading(false);
        });
    }
  };

  return (
    <Button
      loading={exportLoading}
      className={className}
      type="primary"
      onClick={exportGradeBoard}
      icon={<ExportOutlined />}
    >
      Export Grade
    </Button>
  );
}

export default ExportGradeBoard;
