import { Button, Spin } from 'antd';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ErrorPage from '../ErrorPage';

import { useConfirmEmail } from '@/app/store/server/features/auth/mutations';

function EmailConfirmSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { isPending, mutate, isError, error: confirmError } = useConfirmEmail();

  useEffect(() => {
    if (token) {
      mutate({ token } as any);
    }
  }, [mutate, token]);

  if (isPending) {
    return <Spin fullscreen />;
  }

  if (isError && confirmError) {
    if (confirmError instanceof AxiosError) {
      const { response } = confirmError;
      const message = response?.data.message;
      return (
        <div className="flex items-center justify-center min-h-screen p-5 min-w-screen">
          <div className="max-w-xl bg-opacity-50 backdrop-blur p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
            <h3 className="text-2xl m-2">Email verification failed!</h3>
            <div className="text-base">
              <span className="text-base">{message}!</span>
            </div>
            <div className="mt-4">
              <Button
                block
                type="primary"
                className="max-w-fit h-fit rounded px-8 py-2"
                onClick={() => navigate('/sign-in', { replace: true })}
              >
                Go to Sign in
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return <ErrorPage error={confirmError} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-5 min-w-screen">
      <div className="max-w-xl bg-opacity-50 backdrop-blur p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
        <h3 className="text-2xl m-2">Email verification success!</h3>
        <div className="text-base">
          <span>Sign in to get started.</span>
        </div>
        <div className="mt-4">
          <Button
            block
            type="primary"
            className="max-w-fit h-fit rounded px-8 py-2"
            onClick={() => navigate('/sign-in', { replace: true })}
          >
            Go to Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmSuccess;
