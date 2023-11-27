import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import jwtService from '@/services/JwtService';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GoogleOAuthSuccessRedirectProps {}

const GoogleOAuthSuccessRedirect = (props: GoogleOAuthSuccessRedirectProps) => {
  const { accessToken, from } = useParams();
  const navigate = useNavigate();
  console.log(accessToken, from);
  useEffect(() => {
    if (from && accessToken) {
      jwtService.saveToken(accessToken);
      if (from.includes('sign-in')) {
        navigate(`/`, { replace: true });
        return;
      }
      navigate(`/${from}`, { replace: true });
    }
  }, [accessToken, from, navigate]);

  return <div>Loading...</div>;
};

export default GoogleOAuthSuccessRedirect;
