import { Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { useState } from 'react';

import ImportGradeTableModal from '../modal/ImportGradeTableModal';

function ImportGradeButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className={className}
        type="primary"
        onClick={() => setOpen(true)}
        icon={<ImportOutlined />}
      >
        Import Grade Board
      </Button>
      <ImportGradeTableModal open={open} setOpen={setOpen} />
    </>
  );
}

export default ImportGradeButton;
