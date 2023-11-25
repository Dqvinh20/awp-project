import { useState } from 'react';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { NavLink } from 'react-router-dom';

import { useSideMenu } from '@/hooks/useSideMenu';

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

const staticItems: MenuProps['items'] = [
  getItem(<NavLink to={'home'}>Home</NavLink>, 'home'),
  { type: 'divider' },
  getItem('Enrolled', 'enrolled', null, [
    getItem('Web', 'home6'),
    getItem('Class', 'home5'),
  ]),
  { type: 'divider' },
  getItem('Setting', 'setting'),
];

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed(value: boolean): void;
  isMobile: boolean;
  setIsMobile(value: boolean): void;
}

function AppSider({
  collapsed,
  setCollapsed,
  isMobile,
  setIsMobile,
}: AppSiderProps) {
  const menuItems = useSideMenu();
  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
      }}
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
        items={menuItems}
      >
        {/* <Menu.Item className="" key={'home'} style={{ float: 'right' }}>
          <NavLink to={'home'}>Home</NavLink>
        </Menu.Item>
        <Divider className="m-0"></Divider>
        <SubMenu key="sub1" title={'Class'}>
          <Menu.Item className="" key={'home2'} style={{ float: 'right' }}>
            <NavLink to={'home2'}>Home</NavLink>
          </Menu.Item>
          <Menu.Item className="" key={'home1'} style={{ float: 'right' }}>
            <NavLink to={'home1'}>Home1</NavLink>
          </Menu.Item>
        </SubMenu> */}
      </Menu>
    </Sider>
  );
}

export default AppSider;
