/* eslint-disable max-lines-per-function */
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { App, Form, Spin, Card, Input, Button } from 'antd';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSignIn } from '@/app/store/server/features/auth/mutations';
import { SigninData } from '@/app/store/server/features/auth/interfaces';

function AuthPage() {
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
      if (serverError === 'expired') {
        notification.error({
          message: 'Unauthorized',
          description: 'Your session has expired. Please sign in again.',
        });
      } else {
        notification.error({
          message: 'Sign In Failed',
          description: serverError ?? 'Please try again later.',
        });
      }

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
        isAdmin: true,
      },
      {
        onSuccess() {
          notification.success({
            message: 'Sign In Successfully',
          });
          navigate(searchParams.get('return_url') ?? '/admin/accounts');
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
        <h1 className="text-xl sm:text-2xl font-bold ">Sign In As Admin</h1>
        <Form className="color-primary-500" form={form} onFinish={onFinish}>
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

export default AuthPage;
