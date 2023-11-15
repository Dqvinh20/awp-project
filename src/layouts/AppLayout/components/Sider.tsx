import { useState } from 'react';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeOutlined />),

  { type: 'divider' },

  getItem('Setting', 'setting', <SettingOutlined />),
];

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed(value: boolean): void;
}

function AppSider({ collapsed, setCollapsed }: AppSiderProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <Sider
      className="twp !border-r !border-r-gray-300"
      width={200}
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="sm"
      collapsedWidth={isMobile ? 0 : 80}
      onBreakpoint={(broken) => {
        setIsMobile(broken);
        if (!collapsed && broken) setCollapsed(true);
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        style={{ height: '100%', borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
}

export default AppSider;
