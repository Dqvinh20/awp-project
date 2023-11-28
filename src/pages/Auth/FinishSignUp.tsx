import { Button, Flex, Layout, Typography } from 'antd';

import ChooseRoleForm from './ChooseRole';

import AvatarMenu from '@/layouts/components/AvatarMenu';
const { Text, Link } = Typography;

function FinishSignUp() {
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
            <span className="text-base font-semibold block mb-1">
              Before we start, we need to know who you are
            </span>
            <Typography.Text type="warning" className="mb-4 block">
              Please choose carefully! You can not change this later
            </Typography.Text>
            <ChooseRoleForm />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default FinishSignUp;
