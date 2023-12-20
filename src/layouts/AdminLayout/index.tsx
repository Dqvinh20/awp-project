import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppHeader from '../components/Header';
import AppSider from '../components/Sider';

import { useAdminSideMenuItems } from '@/hooks/useAdminSideMenu';

function AdminLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const margin_left_sider = () => {
    if (isMobile && collapsed) return 0;
    if (collapsed) return 80;
    return 200;
  };

  const menuItems = useAdminSideMenuItems();

  return (
    <Layout>
      <AppHeader
        homeUrl="/admin/accounts"
        isAdminHeader
        toggleCollapsed={() => setCollapsed(!collapsed)}
      />
      <Layout hasSider className="min-h-screen">
        <AppSider
          menuItems={menuItems}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
        />
        <Content
          style={{
            marginLeft: margin_left_sider(),
            marginTop: 64,
            transition: 'margin-left 0.2s',
            marginBottom: 0,
          }}
          className=" bg-white m-0 !w-full"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
