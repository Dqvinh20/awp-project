import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import CreateClassModal from '../Modal/CreateClassModal';

function CreateClassButton() {
  const location = useLocation();
  const [openCreateClassModal, setOpenCreateClassModal] = useState(false);

  return (
    <>
      {location.pathname === '/home' && (
        <Button
          shape="circle"
          icon={<PlusOutlined twoToneColor="#52c41a" />}
          onClick={() => setOpenCreateClassModal(true)}
        />
      )}
      <CreateClassModal
        open={openCreateClassModal}
        setOpen={setOpenCreateClassModal}
      />
    </>
  );
}

export default CreateClassButton;
