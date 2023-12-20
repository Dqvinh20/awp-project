import { useGetAllUsers } from '@/app/store/server/features/users/queries';

function AccountsManager() {
  const { data, error, isLoading } = useGetAllUsers();
  return <div className="bg-white h-full w-full p-6"></div>;
}

export default AccountsManager;
