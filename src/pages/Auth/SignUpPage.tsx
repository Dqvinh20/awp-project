/* eslint-disable max-lines-per-function */
import { Form, Input, Button, Card, App, Spin, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { AxiosError } from 'axios';

import { useSearchParams } from 'react-router-dom';

import SentEmailVerification from './SentEmailVerification';

import { useSignUp } from '@/app/store/server/features/auth/mutations';
import { SignupData } from '@/app/store/server/features/auth/interfaces';
import FacebookLoginButton from '@/components/Button/FacebookLoginButton';
import GoogleLoginButton from '@/components/Button/GoogleLoginButton';
import { API_URL } from '@/config/index';
import DocumentTitle from '@/components/DocumentTitle';

function SignUpPage() {
  const { notification } = App.useApp();
  const [searchParams] = useSearchParams();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [sentVerification, setSentVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Query
  const signUp = useSignUp();

  const onFinish = (values: SignupData) => {
    signUp.mutate(
      { ...values },
      {
        onSuccess() {
          notification.success({
            message: 'Sign Up Successfully',
          });
          setSentVerification(true);
        },
        onError(error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.data.statusCode === 409) {
              form.setFields([
                {
                  name: 'email',
                  errors: ['Email already exists'],
                },
              ]);
              return;
            }

            if (!Array.isArray(response?.data.message)) {
              notification.error({
                message: 'Something went wrong!',
                description: 'Please try again later.',
              });
              form.setFields([]);
              return;
            }

            if (
              response?.data.message.some(
                (msg: string) => msg === 'password is not strong enough'
              )
            ) {
              form.setFields([
                {
                  name: 'password',
                  errors: [''],
                },
                {
                  name: 'confirm-password',
                  errors: ['Password is not strong enough'],
                },
              ]);
            } else if (
              error.response?.data.message.some(
                (msg: string) => msg === 'email must be an email'
              )
            ) {
              form.setFields([
                {
                  name: 'email',
                  errors: ['Invalid email'],
                },
              ]);
            }
          }
        },
      }
    );
  };

  if (sentVerification) {
    return <SentEmailVerification />;
  }

  return (
    <>
      <DocumentTitle title="Sign Up" />

      {loading && <Spin fullscreen />}
      <Card className="bg-white bg-opacity-50 backdrop-blur h-fit w-11/12 sm:w-4/5 md:w-2/3 xl:w-1/3">
        <h1 className="text-center text-3xl font-bold ">Sign Up</h1>
        <p className="mb-5 text-center text-sm">
          Already have an account?{' '}
          <a
            href={`/sign-in${window.location.search}`}
            className="text-[#0AAE67]"
          >
            Sign in
          </a>
        </p>
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
            <span className="text-start text-xs">Sign up with google</span>
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
            <span className="text-start text-xs">Sign up with facebook</span>
          </FacebookLoginButton>
        </div>
        <div className="flex flex-row w-full my-2 items-center justify-evenly">
          <div className="bg-gray-800 w-full h-0.5" />
          <span className="text-base text-gray-800 mx-2">or</span>
          <div className="bg-gray-800 w-full h-0.5" />
        </div>
        <Form
          className="color-primary-500"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <div className="w-full flex flex-col justify-between gap-0 sm:flex-row sm:gap-2">
            <Form.Item
              className="w-full"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your First Name!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First Name"
              />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Last Name!',
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
          <Form.Item
            name="email"
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
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Form.Item>
          <Form.Item
            name="confirm-password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The new password that you entered do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
              visibilityToggle={{
                visible: confirmPasswordVisible,
                onVisibleChange: setConfirmPasswordVisible,
              }}
            />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Should accept privacy policy')),
              },
            ]}
          >
            <Checkbox>
              I accept the{' '}
              <a
                href="/privacy-policy"
                className="font-medium hover:underline hover:text-indigo-500"
              >
                Privacy Policy
              </a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={signUp.isPending}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default SignUpPage;
