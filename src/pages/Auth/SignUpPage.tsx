/* eslint-disable max-lines-per-function */
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  ConfigProvider,
  Space,
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';

function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C2A4A',
        },
      }}
    >
      <div className="flex justify-center items-center h-screen bg-[url(../../src/assets/mountain.jpg)] bg-no-repeat bg-cover">
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
            initialValues={{
              remember: true,
            }}
            onFinish={() => {}}
          >
            <Space direction="horizontal">
              <Form.Item
                name="firstName"
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
                name="lastName"
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
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
            <Form.Item
              name="repeat-password"
              rules={[
                {
                  required: true,
                  message: 'Please repeat your Password!',
                },
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
              <Button block type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
}

export default SignUpPage;
