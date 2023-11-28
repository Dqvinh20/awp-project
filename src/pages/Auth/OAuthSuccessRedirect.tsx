import { Navigate } from 'react-router-dom';

import { Spin } from 'antd';

import FinishSignUp from './FinishSignUp';

import useOAuth from '@/hooks/useOAuth';

const OAuthSuccessRedirect = () => {
  const { data, isLoading } = useOAuth();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (data?.role) {
    return <Navigate to="/home" />;
  }

  return <FinishSignUp />;
};

export default OAuthSuccessRedirect;
