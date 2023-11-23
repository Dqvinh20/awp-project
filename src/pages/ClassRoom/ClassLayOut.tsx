import { Link, Outlet, useSearchParams } from 'react-router-dom';
import React from 'react';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;


const LinkMenuClassRoom = [
    {
        lable: 'News',
        path: 'news'
    },
    {
        lable: 'Members',
        path: 'members'
    },
    {
        lable: 'Grade',
        path: 'grade'
    },
]

export default function ClassLayOut() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className='bg-white m-0 h-full w-full'>
      <Header className="twp px-7 bg-white border-b border-b-gray-300">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['2']}
        >
            { 
                LinkMenuClassRoom.map((item) => (
                    <Menu.Item className='' key={item.lable} style={{float:'right'}}>
                        <Link className='p-4' to={item.path}>{item.lable}</Link>
                    </Menu.Item>
                ))
            }
        </Menu>
      </Header>
      <Content className='bg-white m-0 h-full w-full d-flex justify-center items-center'>
        <Outlet />
      </Content>
    </Layout>
  );
}
