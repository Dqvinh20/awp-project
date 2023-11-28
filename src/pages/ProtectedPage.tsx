import { Navigate, Outlet } from 'react-router-dom';

import NeedEmailVerification from './Auth/NeedEmailVerification';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';

function ProtectedPage() {
  const location = window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams();
  searchParams.append('return_url', location);
  const { data, isLoading } = useGetMyInfo();

  if (isLoading) return null;

  if (data && !data?.isEmailConfirmed) {
    return <NeedEmailVerification />;
  }

  return data ? (
    <Outlet />
  ) : (
    <Navigate to={`/sign-in?${searchParams}`} replace={true} />
  );
}

export default ProtectedPage;
