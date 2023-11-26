import { NavLink, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, MenuProps, Spin, App } from 'antd';
import { AxiosError } from 'axios';

import ErrorPage from '../ErrorPage';

import useClassDetail from '@/hooks/useClassDetail';
import UnauthImg from '@/assets/error_401.jpg';
import { useEffect } from 'react';

const { Header, Content } = Layout;

const LinkMenuClassRoom = [
  {
    label: 'News',
    path: 'news',
  },
  {
    label: 'Members',
    path: 'members',
  },
  {
    label: 'Grade',
    path: 'grade',
  },
];

const items: MenuProps['items'] = LinkMenuClassRoom.map((item) => ({
  label: (
    <NavLink className="p-4" to={item.path}>
      {item.label}
    </NavLink>
  ),
  key: item.path,
}));

export default function ClassLayOut() {
  const { notification } = App.useApp();

  const { isLoading, isError, error, isSuccess } = useClassDetail();

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      notification.error({
        message: 'Error Occurred',
        description: error.response?.data.message,
      });
    }
  }, [error, isError, notification]);

  if (isError) {
    if (error instanceof AxiosError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img src={UnauthImg} alt="Not access error" />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorPage error={error} />
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    isSuccess && (
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              headerHeight: 52,
            },
            Menu: {
              activeBarHeight: 4,
              horizontalItemBorderRadius: 0,
              horizontalItemHoverBg: '#f5f5f5',
            },
          },
        }}
      >
        <Layout className=" bg-white m-0 h-full w-full">
          <Header className="twp p-0">
            <Menu
              theme="light"
              mode="horizontal"
              className="px-4"
              defaultSelectedKeys={[
                window.location.pathname.substring(
                  window.location.pathname.lastIndexOf('/') + 1
                ),
              ]}
              items={items}
            ></Menu>
          </Header>
          <Content className="bg-white m-0 h-full w-full d-flex justify-center items-center">
            <Outlet />
          </Content>
        </Layout>
      </ConfigProvider>
    )
  );
}
