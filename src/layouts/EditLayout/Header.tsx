import { Layout, Flex } from 'antd';


import CreateClassButton from '@/components/Button/CreateClassButton';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import AddNewClass from '@/components/Button/AddNewClass';



function EditUserHeader() {

  return (
    <Layout.Header
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 1,
        width: '100%',
        // display: 'flex',
        // alignItems: 'center',
      }}
      className="twp px-7 bg-white border-b border-b-gray-300"
    >
      <div className="flex items-center justify-between h-16">
        <Flex align="center" gap="middle">
          <h2 className="antialiased font-semibold hidden sm:block sm:text-lg text-gray-600">
            <a className="twp hover:text-gray-900" href="/home">
              AWP Classroom
            </a>
          </h2>
        </Flex>
      </div>
    </Layout.Header>
  );
}

export default EditUserHeader;
