import { useParams } from 'react-router-dom';

import { useGetUser } from '@/app/store/server/features/users/queries';

export default function useAccountDetail() {
  const { id } = useParams();
  if (!id) throw new Error('Missing user id');

  return useGetUser(id as string);
}
