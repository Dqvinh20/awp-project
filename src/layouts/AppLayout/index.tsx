import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { useState } from 'react';

import AppHeader from '../components/Header';
import AppSider from '../components/Sider';

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
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
}

export default AppLayout;
