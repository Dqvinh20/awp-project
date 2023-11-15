import { Navigate, Outlet } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import useAuth from '@/hooks/useAuth';

function AuthLayout() {
  const { user_id } = useAuth();

  if (user_id) {
    return <Navigate to="/home" />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C2A4A',
        },
      }}
    >
      <div
        // style={{ '--image-url': `url(${getImgUrl(MountainImg1)})` }}
        className={`flex justify-center items-center h-screen bg-auth-bg bg-no-repeat bg-cover`}
      >
        <Outlet />
      </div>
    </ConfigProvider>
  );
}

export default AuthLayout;
