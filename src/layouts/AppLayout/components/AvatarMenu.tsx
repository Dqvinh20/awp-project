/* eslint-disable no-console */
import { Avatar, Dropdown, MenuProps } from 'antd';
import {
  AntDesignOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';

import jwtService from '@/services/JwtService';

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
    window.location.href = '/';
    jwtService.removeToken();
  }
};

function AvatarMenu() {
  return (
    <Dropdown
      menu={{
        items,
        onClick: menuItemClick,
      }}
      trigger={['click']}
      className="flex items-center"
      placement="bottomLeft"
      arrow
    >
      <div
        onClick={(e) => e.preventDefault()}
        className="cursor-pointer rounded-full p-0.5 hover:bg-gray-300"
      >
        <Avatar
          size={{ xs: 34, sm: 34, md: 42, lg: 42, xl: 42, xxl: 42 }}
          icon={<AntDesignOutlined />}
          alt="Your profile picture"
          src="https://i.pravatar.cc/300"
        />
      </div>
    </Dropdown>
  );
}

export default AvatarMenu;
