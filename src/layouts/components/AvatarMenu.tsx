import { Avatar, Dropdown, Flex, MenuProps, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';

import React, { useMemo } from 'react';

import jwtService from '@/services/JwtService';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { User } from '@/app/store/server/features/users/interfaces';
import authService from '@/services/AuthService';

const menuItemBuilder = (userInfo: User): MenuProps['items'] => {
  if (!userInfo) return [];
  if (!userInfo.isEmailConfirmed || !userInfo.role) {
    return [
      {
        key: 'logout',
        label: 'Logout',
        icon: <LogoutOutlined />,
      },
    ];
  }

  return [
    {
      key: 'editProfile',
      icon: <EditOutlined />,
      label: <a href={`/users/edit/${userInfo.id}`}>Edit Profile</a>,
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
};

const menuItemClick: MenuProps['onClick'] = async ({ key }) => {
  if (key === 'logout') {
    await authService.logout();
    jwtService.removeToken();
    window.location.href = '/';
  }
};

function AvatarMenu() {
  const contentStyle: React.CSSProperties = {
    borderRadius: '28px',
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const { isLoading, data, isError } = useGetMyInfo();

  if (isError || !data) {
    return null;
  }

  const items = useMemo(() => menuItemBuilder(data), [data]);

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
          style={{
            ...contentStyle,
            boxShadow:
              '0 4px 8px 3px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.3)',
          }}
          className="antialiased w-full px-3 py-4 sm:p-5 sm:w-72 z-30 bg-[#e9eef6]"
        >
          <Flex vertical gap={12}>
            <span className="text-center font-semibold text-xm sm:text-base text-[#1f1f1f]">
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
