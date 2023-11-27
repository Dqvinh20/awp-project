/* eslint-disable max-lines-per-function */
import { LockOutlined } from '@ant-design/icons';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';

import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { AxiosError } from 'axios';

import { useResetPassword } from '@/app/store/server/features/auth/mutations';
import { ResetPasswordDto } from '@/app/store/server/features/auth/interfaces';

function ResetPassword() {
  const { notification, message } = App.useApp();

  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const resetPassword = useResetPassword();

  const handleSubmit = () => {
    resetPassword.mutate(
      {
        token,
        new_password: form.getFieldValue('new-password'),
      } as ResetPasswordDto,
      {
        onSuccess() {
          message.success('Reset password successfully');
          navigate('/sign-in');
        },
        onError(error) {
          if (error instanceof AxiosError) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { message: responseMessage } = error?.response?.data;
            if (responseMessage === 'Not Found') {
              notification.error({
                message: 'Reset password failed',
                description: 'Email does not exist.',
              });
              return;
            } else if (Array.isArray(responseMessage)) {
              if (
                responseMessage.some((mess) =>
                  mess.includes('not strong enough')
                )
              ) {
                form.setFields([
                  {
                    name: 'new-password',
                    errors: [''],
                  },
                  {
                    name: 'confirm-password',
                    errors: [
                      'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character!',
                    ],
                  },
                ]);
                return;
              }
            }
            notification.error({
              message: 'Reset password failed',
              description:
                error?.response?.data.message ?? 'Please try again later.',
            });
            return;
          }
          notification.error({
            message: 'Reset password failed',
            description: error.message ?? 'Please try again later.',
          });
        },
      }
    );
  };

  if (!token) {
    return <Navigate to="/page-not-found" />;
  }

  return (
    <div className="bg-white bg-opacity-50 backdrop-blur w-full p-6 rounded-lg shadow m-4 sm:w-1/3">
      <h1 className="text-xl sm:text-2xl font-bold text-center">
        Reset Password
      </h1>
      <Form
        className="color-primary-500"
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <div className="my-8">
          <Form.Item
            name="new-password"
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="New Password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Form.Item>
          <Form.Item
            name="confirm-password"
            dependencies={['new-password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new-password') === value) {
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
              placeholder="Confirm New Password"
              visibilityToggle={{
                visible: confirmPasswordVisible,
                onVisibleChange: setConfirmPasswordVisible,
              }}
            />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={resetPassword.isPending}
          >
            Reset password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;
