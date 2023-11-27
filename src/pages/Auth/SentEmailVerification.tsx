import { App, Button } from 'antd';
import { useEffect, useState } from 'react';

import { Navigate } from 'react-router-dom';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';

import { useResendEmailConfirmation } from '@/app/store/server/features/auth/mutations';

function SentEmailVerification() {
  const { notification } = App.useApp();
  const [resentVerification, setResentVerification] = useState(false);

  const resendEmail = useResendEmailConfirmation();

  const { data } = useGetMyInfo();

  useEffect(() => {
    if (!resentVerification) {
      return;
    }

    const timer = setTimeout(() => {
      setResentVerification(false);
    }, 120000);

    return () => {
      clearTimeout(timer);
    };
  }, [resentVerification]);

  const handleResend = () => {
    if (resentVerification) {
      notification.warning({
        message: 'Send Email Verification Failed',
        description:
          'We have send you an email verification link to your email. Please check your inbox. Try again after 2 minutes.',
      });
      return;
    }

    resendEmail.mutate(undefined, {
      onSuccess() {
        notification.success({
          message: 'Send Email Verification Successfully',
          description:
            'We have send you an email verification link to your email. Please check your inbox.',
        });
        setResentVerification(true);
      },
      onError(error) {
        notification.error({
          message: 'Send Email Verification Failed',
          description: error.message,
        });
      },
    });
  };

  if (data?.isEmailConfirmed) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-5 min-w-screen">
      <div className="max-w-xl bg-opacity-50 backdrop-blur p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
        <h3 className="text-2xl m-2">
          Thanks for signing up for AWP Classroom!
        </h3>
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <div className="flex flex-col text-base">
          <span>
            We're have sent you an email verification link to your email.
          </span>
          <span>Please check your inbox.</span>
        </div>
        <div className="mt-4">
          <Button
            block
            type="primary"
            className="max-w-fit h-fit rounded px-8 py-2"
            onClick={handleResend}
            loading={resendEmail.isPending}
          >
            Resend Email Verification
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SentEmailVerification;
