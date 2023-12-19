import { useQuery } from '@tanstack/react-query';

import GradeReviewService from '@/services/GradeReviewService';

export const classGradeReviewKey = (classId?: string) => [
  'class-grade-review',
  classId,
];
export const useClassGradeReviewQuery = (classId?: string) =>
  useQuery({
    queryKey: classGradeReviewKey(classId),
    queryFn: () => GradeReviewService.getAllGradeReviewsByClass(classId),
    enabled: !!classId,
  });

export const allGradeReviewsKey = ['all_grade_reviews'];

export const useAllGradeReviewsQuery = () =>
  useQuery({
    queryKey: allGradeReviewsKey,
    queryFn: GradeReviewService.getAllGradeReviews,
  });
