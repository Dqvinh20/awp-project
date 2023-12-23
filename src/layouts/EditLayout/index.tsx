import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { useState } from 'react';

import AppHeader from '../components/Header';
import AppSider from '../components/Sider';

import EditUserHeader from './Header';

const { Content } = Layout;

function EditUserLayout() {
  return (
    <Layout className="h-screen">
      <EditUserHeader/>
      <Layout hasSider>
        <Content
          style={{
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

export default EditUserLayout;
