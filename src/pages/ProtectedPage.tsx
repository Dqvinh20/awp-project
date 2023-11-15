import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

function ProtectedPage() {
  const { user_id } = useAuth();

  return user_id ? <Outlet /> : <Navigate to="/" replace={true} />;
}

export default ProtectedPage;
