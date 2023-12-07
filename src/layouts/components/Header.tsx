import { Layout, Flex } from 'antd';

import AvatarMenu from './AvatarMenu';

import AddNewClass from '@/components/Button/AddNewClass';
import NotificationButton from '@/components/Button/NotificationButton';

interface AppHeaderProps {
  toggleCollapsed: () => void;
}

function AppHeader({ toggleCollapsed }: AppHeaderProps) {
  return (
    <Layout.Header
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 20,
        width: '100%',
        // display: 'flex',
        // alignItems: 'center',
      }}
      className="twp px-7 bg-white border-b border-b-gray-300"
    >
      <div className="flex items-center justify-between h-16">
        <Flex align="center" gap="middle">
          <div className="cursor-pointer" onClick={toggleCollapsed}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"></path>
            </svg>
          </div>
          <h2 className="antialiased font-semibold hidden sm:block sm:text-lg text-gray-600">
            <a className="twp hover:text-gray-900" href="/home">
              AWP Classroom
            </a>
          </h2>
        </Flex>
        <div className="flex flex-column items-center gap-x-2">
          <AddNewClass />
          <NotificationButton />
          <AvatarMenu />
        </div>
      </div>
    </Layout.Header>
  );
}

export default AppHeader;
