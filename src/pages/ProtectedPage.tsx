import { Navigate, Outlet } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { useContext } from 'react';

import NeedEmailVerification from './Auth/NeedEmailVerification';

import FinishSignUp from './Auth/FinishSignUp';

import AccessDenied from './AccessDenied';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import {
  WebSocketContext,
  WebSocketProvider,
} from '@/contexts/WebSocketContext.';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import jwtService from '@/services/JwtService';
import DocumentTitle from '@/components/DocumentTitle';

interface ProtectedPageProps {
  roles: Array<USER_ROLE>;
}

function ProtectedPage({ roles }: ProtectedPageProps) {
  const location = window.location.pathname + window.location.search;
  const searchParams = new URLSearchParams();
  searchParams.append('return_url', location);
  const queryClient = useQueryClient();
  const socket = useContext(WebSocketContext);

  const { data: user, isLoading, isSuccess } = useGetMyInfo();

  const logout = async () => {
    await queryClient.removeQueries();
    jwtService.removeToken();
    socket.disconnect();
  };

  if (isLoading) return null;

  if (!isSuccess || !user) {
    logout();
    return <Navigate to={`/sign-in?${searchParams.toString()}`} replace />;
  }

  if (roles.length !== 1 || roles[0] !== USER_ROLE.Admin) {
    if (!user?.isEmailConfirmed) {
      return <NeedEmailVerification />;
    }

    if (!user?.role) {
      return <FinishSignUp />;
    }

    if (user.isActive === false) {
      logout();
      return <Navigate to={`/sign-in?${searchParams.toString()}`} replace />;
    }
  }

  const userHasRequiredRole = !!(user && roles.includes(user.role));
  if (!userHasRequiredRole) {
    return <AccessDenied />;
  }

  if (user.role === USER_ROLE.Admin) {
    return (
      <>
        <DocumentTitle title="Home Admin" />
        <Outlet />
      </>
    );
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
