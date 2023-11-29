import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import CreateClassModal from '../Modal/CreateClassModal';

import JoinClassModal from '../Modal/JoinClassModal';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

function CreateClassButton() {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const { data: user } = useGetMyInfo();

  const renderModal = () => {
    if (user?.role === USER_ROLE.Teacher) {
      return (
        <CreateClassModal
          title="Create new class"
          open={openModal}
          setOpen={setOpenModal}
        />
      );
    }

    return (
      <JoinClassModal
        title="Join new class"
        open={openModal}
        setOpen={setOpenModal}
      />
    );
  };

  const tooltipTitle =
    user?.role === USER_ROLE.Teacher ? 'Create new class' : 'Join new class';

  return (
    <>
      {location.pathname === '/home' && (
        <Tooltip title={tooltipTitle} placement="bottom">
          <Button
            shape="circle"
            icon={<PlusOutlined twoToneColor="#52c41a" />}
            onClick={() => setOpenModal(true)}
          />
        </Tooltip>
      )}
      {renderModal()}
    </>
  );
}

export default CreateClassButton;
