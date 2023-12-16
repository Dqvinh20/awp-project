import { useMutation } from '@tanstack/react-query';

import GradeReviewService from '@/services/GradeReviewService';

export const useCreateGradeReviewMutation = () =>
  useMutation({
    mutationKey: ['create_grade_review'],
    mutationFn: GradeReviewService.createNewGradeReview,
  });
