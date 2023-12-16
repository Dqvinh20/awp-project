import { Button } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import { useState } from 'react';

import ImportGradeTable from '../modal/ImportGradeTable';

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
        Import Grade
      </Button>
      <ImportGradeTable open={open} setOpen={setOpen} />
    </>
  );
}

export default ImportGradeButton;
