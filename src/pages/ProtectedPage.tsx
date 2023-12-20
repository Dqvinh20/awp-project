import { Navigate, Outlet } from 'react-router-dom';

import NeedEmailVerification from './Auth/NeedEmailVerification';

import FinishSignUp from './Auth/FinishSignUp';

import AccessDenied from './AccessDenied';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { WebSocketProvider, socket } from '@/contexts/WebSocketContext.';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import jwtService from '@/services/JwtService';

interface ProtectedPageProps {
  roles: Array<USER_ROLE>;
}

function ProtectedPage({ roles }: ProtectedPageProps) {
  const location = window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams();
  searchParams.append('return_url', location);
  const { data: user, isLoading, isSuccess } = useGetMyInfo();

  if (isLoading) return null;

  if (isSuccess && !user) {
    jwtService.removeToken();
    return <Navigate to={`/sign-in?${searchParams.toString()}`} replace />;
  }

  if (roles.length !== 1 || roles[0] !== USER_ROLE.Admin) {
    if (!user?.isEmailConfirmed) {
      return <NeedEmailVerification />;
    }

    if (!user?.role) {
      return <FinishSignUp />;
    }
  }

  const userHasRequiredRole = !!(user && roles.includes(user.role));
  if (!userHasRequiredRole) {
    return <AccessDenied />;
  }

  return (
    user && (
      <WebSocketProvider value={socket}>
        <Outlet />
      </WebSocketProvider>
    )
  );
}

export default ProtectedPage;
