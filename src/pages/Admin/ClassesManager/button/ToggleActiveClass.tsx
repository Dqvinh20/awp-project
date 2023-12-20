import {
  CheckOutlined,
  LoadingOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { App, Tooltip } from 'antd';

import { useToggleClassActive } from '@/app/store/server/features/classroom/mutations';

interface ToggleActiveClassProps {
  isActive: boolean;
  classId: string;
}

function ToggleActiveClass({ isActive, classId }: ToggleActiveClassProps) {
  if (!classId) {
    throw new Error('classId is required');
  }
  const { message } = App.useApp();
  const { mutate, isPending } = useToggleClassActive();

  const handleToggleActiveClass = () => {
    mutate(
      { classId, isActive },
      {
        onSuccess() {
          message.success(
            isActive
              ? 'Deactive class successfully'
              : 'Active class successfully'
          );
        },
        onError() {
          message.error(
            isActive ? 'Deactive class failed' : 'Active class failed'
          );
        },
      }
    );
  };

  const tooltipTitle = isActive ? 'Deactivate' : 'Activate';
  const icon = isActive ? (
    <StopOutlined className="text-red-500 hover:cursor-pointer" />
  ) : (
    <CheckOutlined className="text-green-500 hover:cursor-pointer" />
  );
  return (
    <Tooltip title={tooltipTitle}>
      <button
        className="twp"
        disabled={isPending}
        onClick={handleToggleActiveClass}
      >
        {isPending ? <LoadingOutlined /> : icon}
      </button>
    </Tooltip>
  );
}

export default ToggleActiveClass;
