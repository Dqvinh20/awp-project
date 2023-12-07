import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';

export function useUserRole(): USER_ROLE {
  const { data } = useGetMyInfo((user) => user.role);
  return data as unknown as USER_ROLE;
}
