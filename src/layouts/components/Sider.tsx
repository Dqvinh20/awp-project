import { useState } from 'react';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { NavLink } from 'react-router-dom';

import { useSideMenu } from '@/hooks/useSideMenu';
import { useQuery } from '@tanstack/react-query';
import ClassRoomService from '@/services/ClassService';

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

function AppSider({ collapsed, setCollapsed isMobile,
  setIsMobile, }: AppSiderProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const menuItems = useSideMenu();
  const { isLoading, data, isError, error, isRefetching } = useQuery({
    queryKey: ['classes'],
    queryFn: () => ClassRoomService.getAllClassRoomByUserId(),
    retry: false,
  });
  const items: MenuProps['items'] = data
    ? [
        {
          label: <NavLink to={'home'}>Home</NavLink>,
          key: 'home',
        },
        {
          type: 'divider',
        },
        {
          label: 'Classes',
          key: 'class',
          children : data && data.docs &&
          data.docs.map((myclass, index) => {
            return {
              label: <NavLink to={'class/' + myclass.id + '/news'}>{myclass.name}</NavLink>,
              key: 'class/' + myclass.id + '/news',
            }
          })
        },
      ]
    : [
        {
          label: <NavLink to={'home'}>Home</NavLink>,
          key: 'home',
        },
      ];
      console.log(window.location.pathname)
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
        selectedKeys={[
          window.location.pathname,
        ]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      >
        {/* <Menu.Item className="" key={'home'} style={{ float: 'right' }}>
        {/* <Menu.Item className="" key={'home'} style={{ float: 'right' }}>
          <NavLink to={'home'}>Home</NavLink>
        </Menu.Item>
        <Divider className="m-0"></Divider>
        <ClassSubMenu /> */}
      </Menu>
    </Sider>
  );
}

export default AppSider;
