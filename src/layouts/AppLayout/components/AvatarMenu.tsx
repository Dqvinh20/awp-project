import { Avatar, Dropdown, MenuProps, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';

import jwtService from '@/services/JwtService';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';

const items: MenuProps['items'] = [
  {
    key: 'editProfile',
    icon: <EditOutlined />,
    label: <a href="/profile/edit">Edit Profile</a>,
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
  const { isLoading, data, isError } = useGetMyInfo();

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
      arrow
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
            size={{ xs: 34, sm: 34, md: 42, lg: 42, xl: 42, xxl: 42 }}
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
