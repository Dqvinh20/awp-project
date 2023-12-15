import { App, Dropdown, MenuProps } from 'antd';
import {
  ExportOutlined,
  ImportOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import ImportGradeTable from '../modal/ImportGradeTable';

import { getFileNameFromContentDisposition } from '@/utils/index';
import ClassGradeService from '@/services/ClassGradeService';

function MoreClassGradeOptions() {
  const { notification } = App.useApp();
  const [open, setOpen] = useState(false);

  const items: MenuProps['items'] = [
    {
      key: 'import-grade-table',
      label: 'Import Grade',
      icon: <ImportOutlined />,
    },
    {
      key: 'export-grade-board',
      label: 'Export Grade Table',
      icon: <ExportOutlined />,
    },
  ];
  const { id: classId } = useParams();
  const exportGradeBoard = () => {
    if (classId) {
      ClassGradeService.exportGradeBoard({ classId, file_type: 'xlsx' })
        .then((response) => {
          const contentDisposition = response.headers['content-disposition'];
          const fileName =
            getFileNameFromContentDisposition(contentDisposition);
          const blob = new Blob([response.data], { type: 'application/xlsx' });
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
        });
    }
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'import-grade-table') {
      setOpen(true);
    }

    if (key === 'export-grade-board') {
      exportGradeBoard();
    }
  };

  return (
    <>
      <Dropdown
        menu={{ items, onClick }}
        arrow
        placement="bottomLeft"
        trigger={['click']}
      >
        <span className="text-gray-600 hover:text-gray-600 hover:bg-gray-300 hover:rounded-full flex items-center justify-center p-2">
          <MoreOutlined style={{ fontSize: '20px', color: 'inherit' }} />
        </span>
      </Dropdown>
      <ImportGradeTable open={open} setOpen={setOpen} />
    </>
  );
}

export default MoreClassGradeOptions;
