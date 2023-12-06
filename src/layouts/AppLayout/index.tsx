import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { useState, useContext, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import AppHeader from '../components/Header';
import AppSider from '../components/Sider';

import { WebSocketContext, retryConnect } from '@/contexts/WebSocketContext.';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useUserRole } from '@/hooks/useUserRole';

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const socket = useContext(WebSocketContext);

  const { data: myId } = useGetMyInfo((user) => user.id);
  const userRole = useUserRole();

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Socket connected!');
      socket.emit('join', myId);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        retryConnect(socket);
      }
      console.log('Socket disconnected!');
    });

    return () => {
      console.log('@AppLayout:', 'Unregistering events...');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [myId, queryClient, socket, userRole]);

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
