import { useLocation, Navigate, Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

const RequireAuth = () => {
  const location = useLocation();
  const { user_id, hasToken } = useAuth();

  console.log(user_id, hasToken);

  const content = user_id && hasToken ? <Outlet /> : <Outlet />;

  return content;
};
export default RequireAuth;
