import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

function AuthLayout() {
  const { user_id } = useAuth();

  if (user_id) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}

export default AuthLayout;
