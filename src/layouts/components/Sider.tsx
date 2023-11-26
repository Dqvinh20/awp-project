import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';

import { useLocation } from 'react-router-dom';

import { useMemo } from 'react';

import { useSideMenuItems } from '@/hooks/useSideMenu';

const extractSelectedKeysFromPathname = (pathname: string): string[] => {
  // Remove the first slash from the path
  const path = pathname.replace(/\//, '');
  if (path.includes('class')) {
    return [path.split('/').slice(0, -1).join('/')];
  }

  return [path];
};

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
  const menuItems = useSideMenuItems();
  const { pathname } = useLocation();

  const selectedKeys = useMemo(
    () => extractSelectedKeysFromPathname(pathname),
    [pathname]
  );

  const defaultOpenKeys = selectedKeys.some((key) => key.includes('class'))
    ? ['classes']
    : [];

  return (
    <Sider
      style={{
        overflow: 'auto',
        // height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
      }}
      theme="light"
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
        theme="light"
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        items={menuItems}
      />
    </Sider>
  );
}

export default AppSider;
