import { useParams } from 'react-router-dom';

import { useClassGradeReviewQuery } from '@/app/store/server/features/grade_review/queries';

export default function useClassGradeReview() {
  const { id } = useParams();
  if (!id) throw new Error('Missing class id');

  return useClassGradeReviewQuery(id as string);
}
