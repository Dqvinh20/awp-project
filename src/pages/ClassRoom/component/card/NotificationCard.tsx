import { NotificationOutlined } from '@ant-design/icons';
import { Avatar, Flex, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
interface CardProps {
  className?: string;
  title?: string;
  message?: string;
  linkUrl?: string;
}

export default function NotificationCard({
  title = '',
  message = '',
  className = 'w-full mb-6 sm:mb-0 bg-white rounded-lg border border-gray-300 flex items-center px-5 py-5',
  linkUrl=''
}: CardProps) {
  const navigate = useNavigate()
  const handleClickCard = ()=>{
    if(linkUrl) navigate(linkUrl)
  }
  return (
    <Flex onClick={handleClickCard} className={className+ ' cursor-pointer'} align="center" justify="start" gap={'middle'}>
      <Flex flex={1} justify="start">
        <Space align="center" size="middle">
          <Avatar
            className="hidden sm:block w-[32px] h-[32px]"
            icon={<NotificationOutlined />}
            style={{ backgroundColor: '#87d068' }}
          />
          <Flex flex={1} vertical>
            <span className="font-semibold leading-5">{title}</span>
            <span className="leading-5">{message}</span>
          </Flex>
        </Space>
      </Flex>
      {/* {dropDownRender()} */}
    </Flex>
  );
}
