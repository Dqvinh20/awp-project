import { Navigate, Outlet } from 'react-router-dom';

import NeedEmailVerification from './Auth/NeedEmailVerification';

import FinishSignUp from './Auth/FinishSignUp';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { WebSocketProvider, socket } from '@/contexts/WebSocketContext.';

function ProtectedPage() {
  const location = window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams();
  searchParams.append('return_url', location);
  const { data, isLoading } = useGetMyInfo();

  if (isLoading) return null;

  if (data && !data?.isEmailConfirmed) {
    return <NeedEmailVerification />;
  }

  if (data && !data?.role) {
    return <FinishSignUp />;
  }

  return data ? (
    <WebSocketProvider value={socket}>
      <Outlet />
    </WebSocketProvider>
  ) : (
    <Navigate to={`/sign-in?${searchParams}`} replace={true} />
  );
}

export default ProtectedPage;
