/* eslint-disable max-lines-per-function */
import { Form, Input, Button, Card, Space, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { AxiosError } from 'axios';

import { useSignUp } from '@/app/store/server/features/auth/mutations';
import { SignupData } from '@/app/store/server/features/auth/interfaces';

function SignUpPage() {
  const { notification } = App.useApp();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [form] = Form.useForm();

  // React Query
  const signUp = useSignUp();

  const onFinish = (values: SignupData) => {
    console.log({...values,role:'Student'})
    signUp.mutate({...values,role:'Student'}, {
      onSuccess() {
        notification.success({
          message: 'Sign Up Successfully',
        });
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
    });
  };
  return (
    <Card
      style={{ width: 400, height: 450 }}
      className="bg-white bg-opacity-50 backdrop-blur"
    >
      <h1 className="text-center text-3xl font-bold ">Sign Up</h1>
      <p className="mb-5 text-center text-sm">
        Already have an account?{' '}
        <a href="/sign-in" className="text-[#0AAE67]">
          Sign in
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
        <Space direction="horizontal">
          <Form.Item
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
        </Space>
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
  );
}

export default SignUpPage;
