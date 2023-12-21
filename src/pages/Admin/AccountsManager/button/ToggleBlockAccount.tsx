import {
  CheckOutlined,
  LoadingOutlined,
  LockOutlined,
  StopOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { App, Tooltip } from 'antd';

import { useToggleBlockAccount } from '@/app/store/server/features/users/mutations';

interface ToggleBlockAccountProps {
  isActive: boolean;
  userId: string;
}

function ToggleBlockAccount({ isActive, userId }: ToggleBlockAccountProps) {
  if (!userId) {
    throw new Error('userId is required');
  }
  const { message } = App.useApp();
  const { mutate, isPending } = useToggleBlockAccount();

  const handleToggleBlockAccount = () => {
    mutate(
      { userId, isActive },
      {
        onSuccess() {
          message.success(
            isActive
              ? 'Block account  successfully'
              : 'Unblock account successfully'
          );
        },
        onError() {
          message.error(
            isActive ? 'Block account failed' : 'Unblock account failed'
          );
        },
      }
    );
  };

  const tooltipTitle = isActive ? 'Block' : 'Unblock';
  const icon = isActive ? (
    <LockOutlined className="text-red-500 hover:cursor-pointer" />
  ) : (
    <UnlockOutlined className="text-green-500 hover:cursor-pointer" />
  );
  return (
    <Tooltip title={tooltipTitle}>
      <button
        className="twp"
        disabled={isPending}
        onClick={handleToggleBlockAccount}
      >
        {isPending ? <LoadingOutlined /> : icon}
      </button>
    </Tooltip>
  );
}

export default ToggleBlockAccount;
