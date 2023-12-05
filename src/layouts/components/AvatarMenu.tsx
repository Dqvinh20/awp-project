import { Avatar, Dropdown, Flex, Image, MenuProps, Spin, Tooltip } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import React, { useMemo, useState } from 'react';

import jwtService from '@/services/JwtService';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { User } from '@/app/store/server/features/users/interfaces';
import authService from '@/services/AuthService';
import EditProfileModal from '@/components/Modal/EditProfileModal';

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
      label: 'Edit Profile',
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

function AvatarMenu() {
  const [openEdit, setOpenEdit] = useState(false);
  const contentStyle: React.CSSProperties = {
    borderRadius: '28px',
  };

  const menuItemClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await authService.logout();
      jwtService.removeToken();
      window.location.href = '/';
    }

    if (key === 'editProfile') {
      setOpenEdit(true);
    }
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const { isLoading, data, isError } = useGetMyInfo();

  if (isError || !data) {
    return null;
  }

  const items = useMemo(() => menuItemBuilder(data), [data]);

  const AvatarImage = ({ src }: { src?: string | undefined }) => (
    <Image
      preview={{
        mask: (
          <div className="bg-opacity-50">
            <EyeOutlined className="bg-transparent bg-opacity-50" />
          </div>
        ),
      }}
      src={src}
      fallback="data:image/png;base64,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"
    />
  );

  return (
    <>
      <EditProfileModal open={openEdit} onCancel={() => setOpenEdit(false)} />
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
                  src={isError ? null : <AvatarImage src={data?.avatar} />}
                  className="mx-auto"
                />
                <span className="text-center uppercase text-lg/relaxed font-sans">
                  Hi, {data?.first_name ?? data?.last_name ?? 'Welcome back'}!
                </span>
                <Tooltip title="Student ID" placement="bottom">
                  <span className="text-center line-clamp-1 max-w-sm text-sm text-blue-400 underline hover:pointer-events-auto hover:cursor-help">
                    20127665
                  </span>
                </Tooltip>
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
    </>
  );
}

export default AvatarMenu;
