import { Form, Input, Button, Checkbox, Card, ConfigProvider } from 'antd';
import { MailOutlined, LockOutlined} from '@ant-design/icons';
import { useState } from 'react';


function SignInPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C2A4A',
        }
      }}
    >
      <div className="flex justify-center items-center h-screen bg-[url(../../src/assets/mountain.jpg)] bg-no-repeat bg-cover">
        <Card style={{ width: 400, height: 380}} className="bg-white bg-opacity-50 backdrop-blur">
          <h1 className="text-center text-3xl font-bold ">Log In</h1>
          <p className="text-center text-xs">Don't have an account yet? <a href="/sign-up" className='text-[#0AAE67]'>Register now!</a></p>
          <Form
            className="color-primary-500"
            initialValues={{
              remember: true,
            }}
            onFinish={() => {}}
          >
            <Form.Item
              name="username"
              className="my-5"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
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
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>
            <div className="flex justify-between my-5">
              
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="">Remember me</Checkbox>
                </Form.Item>

                <a className="text-[#0AAE67]" href="">
                  Forgot password
                </a>
            </div>
            <Form.Item
              className="mt-10"
              >
              <Button block type="primary"  htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
        </div>
    </ConfigProvider>

  );
}

export default SignInPage;
