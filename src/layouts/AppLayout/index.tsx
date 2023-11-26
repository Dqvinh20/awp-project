import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { useState } from 'react';

import AppHeader from '../components/Header';
import AppSider from '../components/Sider';

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const margin_left_sider = () => {
    if (isMobile && collapsed) return 0;
    if (collapsed) return 80;
    return 200;
  };

  return (
    <Layout className="h-screen">
      <AppHeader toggleCollapsed={() => setCollapsed(!collapsed)} />
      <Layout hasSider>
        <AppSider
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
          }}
          className=" bg-white m-0 h-full w-full"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
