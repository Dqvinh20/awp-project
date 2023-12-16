import { useQuery } from '@tanstack/react-query';

import GradeReviewService from '@/services/GradeReviewService';

export const classGradeReviewKey = (classId?: string) => [
  'class_grade_review',
  classId,
];
export const useClassGradeReview = (classId?: string) =>
  useQuery({
    queryKey: classGradeReviewKey(classId),
    queryFn: () => GradeReviewService.getAllGradeReviewsByClass(classId),
    enabled: !!classId,
  });
