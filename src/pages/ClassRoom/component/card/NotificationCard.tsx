import { NotificationOutlined } from '@ant-design/icons';
import { Avatar, Flex, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { NotificationDTO } from '@/app/store/server/features/notifications/interfaces';
interface NotificationCardProps extends Partial<NotificationDTO> {
  className?: string;
}

export default function NotificationCard({
  title = '',
  message = '',
  className = 'w-full mb-6 sm:mb-0 bg-white rounded-lg border border-gray-300 flex items-center px-5 py-5 hover:drop-shadow',
  ref_url = '',
}: NotificationCardProps) {
  const navigate = useNavigate();
  const handleClickCard = () => {
    if (ref_url) navigate(ref_url);
  };

  return (
    <Flex
      onClick={handleClickCard}
      className={`${className} cursor-pointer`}
      align="center"
      justify="start"
      gap={'middle'}
    >
      <Flex flex={1} justify="start">
        <Space align="center" size="middle">
          <Avatar
            className="hidden sm:flex justify-center items-center pr-1 w-[32px] h-[32px] "
            icon={<NotificationOutlined />}
            style={{ backgroundColor: '#87d068' }}
          />
          <Flex flex={1} vertical>
            <span className="text-base font-semibold leading-6">{title}</span>
            <span
              className="leading-5"
              dangerouslySetInnerHTML={{ __html: message ?? '' }}
            ></span>
          </Flex>
        </Space>
      </Flex>
    </Flex>
  );
}
