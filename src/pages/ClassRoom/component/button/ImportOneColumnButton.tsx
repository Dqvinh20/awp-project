import { Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { useState } from 'react';

import ImportOneColumnModal from '../modal/ImportOneColumnModal';

import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';

interface ImportOneColumnButtonProps {
  className?: string;
  columns: GradeColumn[];
}

function ImportOneColumnButton({
  className,
  columns,
}: ImportOneColumnButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className={className}
        type="default"
        onClick={() => setOpen(true)}
        icon={<ImportOutlined />}
      >
        Import One Column
      </Button>
      <ImportOneColumnModal columns={columns} open={open} setOpen={setOpen} />
    </>
  );
}

export default ImportOneColumnButton;
