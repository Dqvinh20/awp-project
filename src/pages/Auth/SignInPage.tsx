/* eslint-disable max-lines-per-function */
import { App, Form, Input, Button, Checkbox, Card, Spin } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSignIn } from '@/app/store/server/features/auth/mutations';
import { SigninData } from '@/app/store/server/features/auth/interfaces';
import GoogleLoginButton from '@/components/Button/GoogleLoginButton';
import FacebookLoginButton from '@/components/Button/FacebookLoginButton';
import { API_URL } from '@/config/index';

function SignInPage() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const serverError = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serverError) {
      setLoading(false);
      notification.error({
        message: 'Sign In Failed',
        description: serverError ?? 'Please try again later.',
      });
      searchParams.delete('error');
      setSearchParams(searchParams);
    }
  }, [notification, searchParams, serverError, setSearchParams]);

  // React Query
  const signIn = useSignIn();

  const onFinish = (values: SigninData) => {
    signIn.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess() {
          notification.success({
            message: 'Sign In Successfully',
          });
          navigate(searchParams.get('return_url') ?? '/home');
        },
        onError(error) {
          if (error instanceof AxiosError) {
            if (error.response?.data.message === 'Wrong credentials!!') {
              form.setFields([
                {
                  name: 'email',
                  errors: [''],
                },
                {
                  name: 'password',
                  errors: ['Invalid email or password'],
                },
              ]);
              return;
            }

            if (!Array.isArray(error.response?.data.message)) {
              notification.error({
                message: 'Something went wrong!',
                description: 'Please try again later.',
              });
              form.setFields([]);
            }
          }
        },
      }
    );
  };
  return (
    <>
      {loading && <Spin fullscreen />}
      <Card className="bg-white bg-opacity-50 backdrop-blur w-full h-fit m-4 text-center md:w-2/3 lg:w-1/3">
        <h1 className="text-xl sm:text-3xl font-bold ">Sign In</h1>
        <p className="text-xs sm:text-sm">
          Don't have an account yet?{' '}
          <a
            href={`/sign-up${window.location.search}`}
            className="text-[#0AAE67] hover:text-indigo-600 font-medium inline-flex space-x-1 items-center"
          >
            Register now!
          </a>
        </p>
        <Form
          className="color-primary-500"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            className="my-5"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            className="my-5"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Form.Item>
          <div className="flex justify-between my-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="">Remember me</Checkbox>
            </Form.Item>

            <a
              className="text-[#0AAE67] hover:text-indigo-600 font-medium inline-flex space-x-1 items-center"
              href="/forgot-password"
            >
              Forgot password
            </a>
          </div>
          <div className="flex flex-row w-full mb-4 items-center justify-evenly">
            <div className="bg-gray-800 w-full h-0.5" />
            <span className="text-base text-gray-800 mx-2">or</span>
            <div className="bg-gray-800 w-full h-0.5" />
          </div>
          <div className="flex flex-col justify-between sm:flex-row w-full gap-4">
            <GoogleLoginButton
              type="button"
              className="flex items-center w-full bg-white border border-gray-300
          rounded-lg shadow-md max-w-full px-3 py-2 text-sm font-medium
          text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-gray-500"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `${API_URL}/auth/google/${window.location.pathname.replace(
                    /\//g,
                    '@'
                  )}?return_url=${searchParams.get('return_url') ?? ''}`,
                  '_self'
                );
                setLoading(true);
              }}
            >
              <span className="text-start text-xs">Sign in with google</span>
            </GoogleLoginButton>
            <FacebookLoginButton
              type="button"
              className="flex items-center w-full bg-white border border-gray-300 rounded-lg shadow-md max-w-full px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `${API_URL}/auth/facebook/${window.location.pathname.replace(
                    /\//g,
                    '@'
                  )}?return_url=${searchParams.get('return_url') ?? ''}`,
                  '_self'
                );
                setLoading(true);
              }}
            >
              <span className="text-start text-xs">Sign in with facebook</span>
            </FacebookLoginButton>
          </div>
          <Form.Item className="mt-4">
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={signIn.isPending}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default SignInPage;
