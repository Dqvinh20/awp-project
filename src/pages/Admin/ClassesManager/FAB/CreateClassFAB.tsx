import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useState } from 'react';

import CreateClassAdminModal from '../modal/CreateClassAdminModal';

function CreateClassFAB() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <FloatButton
        type="primary"
        tooltip="Create class"
        onClick={() => setOpenModal(true)}
        icon={<PlusOutlined />}
      />
      <CreateClassAdminModal
        title="Create class"
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}

export default CreateClassFAB;
