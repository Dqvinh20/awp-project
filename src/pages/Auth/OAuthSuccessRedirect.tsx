import { Navigate, useSearchParams } from 'react-router-dom';

import { Spin } from 'antd';

import FinishSignUp from './FinishSignUp';

import useOAuth from '@/hooks/useOAuth';

const OAuthSuccessRedirect = () => {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('return_url');
  const { data, isLoading } = useOAuth();

  if (isLoading) {
    return <Spin fullscreen />;
  }

  if (data?.role) {
    if (returnUrl && returnUrl !== 'undefined' && returnUrl !== 'null') {
      return <Navigate to={returnUrl} />;
    }
    return <Navigate to="/home" />;
  }

  return <FinishSignUp />;
};

export default OAuthSuccessRedirect;
