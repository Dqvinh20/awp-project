import { App, Button, Flex, Layout } from 'antd';

import { useState } from 'react';

import { Navigate } from 'react-router-dom';

import Countdown from 'antd/es/statistic/Countdown';

import AvatarMenu from '@/layouts/components/AvatarMenu';
import { useResendEmailConfirmation } from '@/app/store/server/features/auth/mutations';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';

const timeout = 120000;

function NeedEmailVerification() {
  const { notification } = App.useApp();
  const [resentVerification, setResentVerification] = useState(false);
  const [countdown, setCountDown] = useState<number>();

  const resendEmail = useResendEmailConfirmation();

  const { data } = useGetMyInfo();

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
        setCountDown(Date.now() + timeout);
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
    <Layout>
      <Layout.Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}
        className="twp antialiased px-7 bg-white border-b border-b-gray-300"
      >
        <div className="flex items-center justify-between h-16">
          <Flex align="center" gap="middle">
            <h2 className="antialiased font-semibold hidden sm:block sm:text-lg text-gray-600">
              <a className="twp hover:text-gray-900" href="/home">
                AWP Classroom
              </a>
            </h2>
          </Flex>
          <div className="flex flex-column items-center gap-x-2">
            <AvatarMenu />
          </div>
        </div>
      </Layout.Header>
      <Layout.Content>
        <div className="bg-gray-300 w-full h-screen flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 mx-4 sm:mx-auto my-auto max-w-xl md:py-6 shadow-lg border-2 border-gray-500">
            <h1 className="text-base sm:text-xl">Please verify your email</h1>
            <p className="pt-2 text-base md:text-xl md:pt-3">
              Meanwhile we'd love to have you get started right now, we still
              need you to verify your email. Please verify your email by
              clicking the link in the email we sent you.
            </p>
            {resentVerification && (
              <Countdown
                value={countdown}
                prefix={'Please try again in '}
                suffix={' seconds'}
                valueStyle={{
                  fontSize: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                }}
                format={'ss'}
                onFinish={() => {
                  setResentVerification(false);
                }}
              />
            )}

            <Button
              block
              disabled={resentVerification}
              type="primary"
              className="max-w-fit h-fit rounded px-8 py-2"
              onClick={handleResend}
              loading={resendEmail.isPending}
            >
              Resend Email Verification
            </Button>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default NeedEmailVerification;
