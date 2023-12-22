import { FloatButton, Spin } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';

import CreateAccountFAB from './FAB/CreateAccountFAB';
import AccountTable from './tables/AccountTable';
import ImportStudentIdFAB from './FAB/ImportStudentIdFAB';

import { useGetAllUsers } from '@/app/store/server/features/users/queries';

import DocumentTitle from '@/components/DocumentTitle';
import ErrorPage from '@/pages/ErrorPage';

function AccountsManager() {
  const {
    data: userList,
    isLoading,
    isSuccess,
    error,
    isError,
  } = useGetAllUsers();

  return (
    <>
      <DocumentTitle title="Accounts Manager" />
      <div className="bg-white h-full w-full px-6 py-4">
        {isError && <ErrorPage error={error} />}
        {isLoading && (
          <div className="h-full w-full flex justify-center items-center">
            <Spin />
          </div>
        )}
        {isSuccess && (
          <>
            <FloatButton.Group
              trigger="hover"
              type="primary"
              style={{ right: 24 }}
              icon={<CaretUpOutlined />}
            >
              <ImportStudentIdFAB />
              <CreateAccountFAB />
            </FloatButton.Group>
            <AccountTable
              title={() => (
                <span className="text-base font-semibold">Account Table</span>
              )}
              accounts={userList?.items ?? []}
              loading={isLoading}
            />
          </>
        )}
      </div>
    </>
  );
}

export default AccountsManager;
