// eslint-disable-next-line max-lines-per-function
import { App, Button, Spin } from 'antd';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { useForgotPassword } from '@/app/store/server/features/auth/mutations';

function ForgotPassword() {
  const { notification } = App.useApp();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const forgotPassword = useForgotPassword();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!email) {
      setEmailError('Email is required');
      notification.error({
        message: 'Forgot password failed',
        description: 'Email is required',
      });
      return;
    }
    forgotPassword.mutate(email, {
      onSuccess() {
        notification.success({
          message: 'Reset password successfully',
          description: 'Please check your email to reset password',
        });
      },
      onError(error) {
        if (error instanceof AxiosError) {
          setEmailError(error?.response?.data.message);
          if (error?.response?.data.message === 'Not Found') {
            notification.error({
              message: 'Forgot password failed',
              description: 'Email does not exist.',
            });
            return;
          }
          notification.error({
            message: 'Forgot password failed',
            description:
              error?.response?.data.message ?? 'Please try again later.',
          });
          return;
        }
        notification.error({
          message: 'Forgot password failed',
          description: error.message ?? 'Please try again later.',
        });
        setEmailError(error.message);
      },
    });
  };
  return (
    <>
      {forgotPassword.isPending && <Spin fullscreen />}
      <div className="twp antialiased w-full px-4 sm:px-0 md:w-1/2 lg:w-1/3">
        <div className="bg-opacity-50 backdrop-blur h-fit mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
          <h1 className="text-2xl sm:text-3xl font-medium">Reset password</h1>
          <p className="text-xs sm:text-base text-slate-500">
            Fill up the form to reset the password
          </p>
          <form onSubmit={handleSubmit} className="my-5">
            <div className="flex flex-col space-y-5">
              <label htmlFor="email">
                <p className="font-medium text-slate-700 pb-2">Email address</p>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`w-full py-3 border ${
                    emailError ? 'border-red-400' : 'border-slate-200'
                  }  rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                  placeholder="Enter email address"
                />
              </label>
              <Button
                className="bg-[#2c2a4a]"
                block
                type="primary"
                htmlType="submit"
                loading={forgotPassword.isPending}
              >
                Reset password
              </Button>
              <p className="text-center">
                Not registered yet?{' '}
                <a
                  href="/sign-in"
                  className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                >
                  <span>Sign up now </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
