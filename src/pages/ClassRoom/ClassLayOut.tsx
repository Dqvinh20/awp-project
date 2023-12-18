/* eslint-disable max-lines-per-function */
import { NavLink, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, MenuProps, Spin, App } from 'antd';
import { AxiosError } from 'axios';

import { useEffect, useMemo } from 'react';

import ErrorPage from '../ErrorPage';

import useClassDetail from '@/hooks/useClassDetail';
import UnauthImg from '@/assets/error_401.jpg';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import useClassGradeReview from '@/hooks/useClassGradeReview';

const { Header, Content } = Layout;

export default function ClassLayOut() {
  const { notification } = App.useApp();

  const { isLoading, isError, error, isSuccess } = useClassDetail();
  const { data: gradeReview } = useClassGradeReview();

  const userRole = useUserRole();

  const items = useMemo((): MenuProps['items'] => {
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

    if (userRole === USER_ROLE.Teacher) {
      LinkMenuClassRoom.push({
        label: 'Grade Structure',
        path: 'grade-structure',
      });
    }

    if (gradeReview && gradeReview.length > 0) {
      LinkMenuClassRoom.push({
        label: 'Grade review',
        path: 'grade-review',
      });
    }

    return LinkMenuClassRoom.map((item) => ({
      label: (
        <NavLink className="p-4" to={item.path}>
          {item.label}
        </NavLink>
      ),
      key: item.path,
    }));
  }, [userRole, gradeReview]);

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      notification.error({
        message: 'Error Occurred',
        description: error.response?.data.message,
      });
    }
  }, [error, isError, notification]);

  if (isError) {
    if (
      error instanceof AxiosError &&
      error.response?.data.message ===
        "You don't have permission to access. You are not in this class"
    ) {
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
