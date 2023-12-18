import { useMutation } from '@tanstack/react-query';

import GradeReviewService from '@/services/GradeReviewService';

export const useCreateGradeReviewMutation = () =>
  useMutation({
    mutationKey: ['create_grade_review'],
    mutationFn: GradeReviewService.createNewGradeReview,
  });

export const useAddCommentMutation = () =>
  useMutation({
    mutationKey: ['add_comment'],
    mutationFn: GradeReviewService.addComment,
  });

export const useFinishGradeReviewMutation = () =>
  useMutation({
    mutationKey: ['finish_grade_review'],
    mutationFn: GradeReviewService.finishGradeReview,
  });
