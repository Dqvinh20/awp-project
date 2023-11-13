import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';

import { useState } from 'react';

import AppHeader from './components/Header';
import AppSider from './components/Sider';

const { Content, Sider } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  // TODO: Replace this with your own authentication logic.
  const isAuthenticated = true;

  const renderBody = () => (
    <Layout className="h-screen">
      <AppHeader toggleCollapsed={() => setCollapsed(!collapsed)} />
      <Layout hasSider>
        <AppSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className=" bg-white p-6 m-0">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );

  return isAuthenticated ? renderBody() : <Navigate to="/sign-in" />;
}

export default AppLayout;
