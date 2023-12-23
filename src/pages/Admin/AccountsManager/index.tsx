import CreateAccountFAB from './FAB/CreateAccountFAB';

import AccountTable from './tables/AccountTable';

import { useGetAllUsers } from '@/app/store/server/features/users/queries';

import DocumentTitle from '@/components/DocumentTitle';

function AccountsManager() {
  const { data: userList, isLoading } = useGetAllUsers();

  return (
    <>
      <DocumentTitle title="Accounts Manager" />
      <div className="bg-white h-full w-full px-6 py-4">
        <CreateAccountFAB />
        <AccountTable
          title={() => (
            <span className="text-base font-semibold">Account Table</span>
          )}
          accounts={userList?.items ?? []}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default AccountsManager;
