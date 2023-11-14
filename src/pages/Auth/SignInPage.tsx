import { Form, Input, Button, Checkbox, Card, ConfigProvider } from 'antd';
import { MailOutlined, LockOutlined} from '@ant-design/icons';
import { useState } from 'react';

import { AxiosError } from 'axios';

import { useSignIn } from '@/app/store/server/features/auth/mutations';
import { SigninData } from '@/app/store/server/features/auth/interfaces';



function SignInPage() {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const signIn = useSignIn();
  
  const onFinish = (values: SigninData) => {
    signIn.mutate({
      email: values.email,
      password: values.password
    
    }, {onError(error) {
      if(error instanceof AxiosError) {
        if(error.response?.data.message === 'Wrong credentials!!') {
          form.setFields([
            {
              name: 'email',
              errors: [""],
            },
            {
              name: 'password',
              errors: ['Invalid email or password'],
            },
          ]);
      }  
      }
    }
    }
    );  
  }
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
          <h1 className="text-center text-3xl font-bold ">Sign In</h1>
          <p className="text-center text-sm">Don't have an account yet? <a href="/sign-up" className='text-[#0AAE67]'>Register now!</a></p>
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
              defaultValue="johndoe@example.com"
              prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
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
                
                defaultValue="1232@asdS"
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
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
        </div>
    </ConfigProvider>

  );
}

export default SignInPage;
