import { Navigate, Outlet } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import useAuth from '@/hooks/useAuth';

interface AuthLayoutProps {
  authRedirectUrl?: string;
}

function AuthLayout({ authRedirectUrl }: AuthLayoutProps) {
  const { user_id } = useAuth();

  if (user_id) {
    return <Navigate to={authRedirectUrl ?? '/home'} replace={true} />;
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
        className={`flex justify-center items-center h-screen bg-auth-bg bg-no-repeat bg-cover`}
      >
        <Outlet />
      </div>
    </ConfigProvider>
  );
}

export default AuthLayout;
