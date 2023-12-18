import { useParams } from 'react-router-dom';

import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';

export default function useClassGrade() {
  const { id } = useParams();
  if (!id) throw new Error('Missing class id');

  return useGetClassGrades(id as string);
}
