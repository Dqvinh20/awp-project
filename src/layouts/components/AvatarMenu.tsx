import { Avatar, Dropdown, Flex, MenuProps, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';

import React, { useMemo } from 'react';

import jwtService from '@/services/JwtService';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import useAuth from '@/hooks/useAuth';

const menuItemBuilder = (user_id: string | null): MenuProps['items'] => [
  {
    key: 'editProfile',
    icon: <EditOutlined />,
    label: <a href={`/users/edit/${user_id}`}>Edit Profile</a>,
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
  },
];

const menuItemClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'logout') {
    jwtService.removeToken();
    window.location.href = '/';
  }
};

function AvatarMenu() {
  const contentStyle: React.CSSProperties = {
    borderRadius: '32px',
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const { isLoading, data, isError } = useGetMyInfo();
  const { user_id } = useAuth();

  const items = useMemo(() => menuItemBuilder(user_id), [user_id]);

  return (
    <Dropdown
      menu={{
        items,
        onClick: menuItemClick,
      }}
      trigger={['click']}
      disabled={isLoading}
      className="flex items-center"
      placement="bottomLeft"
      dropdownRender={(menu) => (
        <div
          style={contentStyle}
          className="p-4 w-52 sm:w-72 z-30 bg-emerald-100 shadow-[-1px_1px_3px_3px_rgba(0,0,0,0.2)]"
        >
          <Flex vertical gap={12}>
            <span className="text-center font-semibold text-base">
              {data?.email}
            </span>
            <Flex vertical gap={4}>
              <Avatar
                size={52}
                icon={<UserOutlined />}
                alt="Your profile picture"
                src={isError ? null : data?.avatar}
                className="mx-auto"
              />
              <span className="text-center uppercase text-lg/relaxed font-sans">
                Hi, {data?.first_name ?? data?.last_name ?? 'Welcome back'}!
              </span>
            </Flex>
          </Flex>

          <div className="h-3"></div>
          <div>
            {React.cloneElement(menu as React.ReactElement, {
              style: menuStyle,
            })}
          </div>
        </div>
      )}
    >
      <div
        onClick={(e) => e.preventDefault()}
        className={`cursor-pointer rounded-full ${
          isLoading ? 'p-3' : 'p-0.5 hover:bg-gray-300'
        }`}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Avatar
            size={{ sm: 40 }}
            icon={<UserOutlined />}
            alt="Your profile picture"
            src={isError ? null : data?.avatar}
          />
        )}
      </div>
    </Dropdown>
  );
}

export default AvatarMenu;
