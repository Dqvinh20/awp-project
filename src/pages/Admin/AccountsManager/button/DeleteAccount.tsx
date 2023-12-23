import { DeleteOutlined } from '@ant-design/icons';
import { App, Popconfirm, Tooltip } from 'antd';

import { useDeleteAccounts } from '@/app/store/server/features/users/mutations';

interface DeleteAccountProps {
  userId: string;
}

function DeleteAccount({ userId }: DeleteAccountProps) {
  const { message } = App.useApp();
  const { mutate: deleteUser } = useDeleteAccounts();
  const confirm = () => {
    deleteUser(userId, {
      onSuccess() {
        message.success('Deleted account successfully');
      },
      onError() {
        message.error('Deleted account failure');
      },
    });
  };
  return (
    <div>
      <Tooltip title="Delete account">
        <Popconfirm
          title="Delete account"
          description="Are you sure to delete this account?"
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"
          placement="bottomRight"
        >
          <DeleteOutlined className="text-red-500" />
        </Popconfirm>
      </Tooltip>
    </div>
  );
}

export default DeleteAccount;
