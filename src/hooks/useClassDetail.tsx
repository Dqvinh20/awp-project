import { useParams } from 'react-router-dom';

import { useClassDetailQuery } from '@/app/store/server/features/classroom/queries';

export default function useClassDetail() {
  const { id } = useParams();

  return useClassDetailQuery(id as string);
}
