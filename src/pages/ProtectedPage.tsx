import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

function ProtectedPage() {
  const { user_id } = useAuth();
  const location = window.location.pathname;
  const searchParams = new URLSearchParams();
  searchParams.append('return_url', location);

  return user_id ? (
    <Outlet />
  ) : (
    <Navigate to={`/sign-in?${searchParams}`} replace={true} />
  );
}

export default ProtectedPage;
