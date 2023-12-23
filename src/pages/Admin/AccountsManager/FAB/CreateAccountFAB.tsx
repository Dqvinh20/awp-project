import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useState } from 'react';

import CreateAccountModal from '../modal/CreateAccountModal';

function CreateAccountFAB() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <FloatButton
        type="primary"
        tooltip="Create account"
        onClick={() => setOpenModal(true)}
        icon={<PlusOutlined />}
      />
      <CreateAccountModal
        title="Create account"
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  );
}

export default CreateAccountFAB;
