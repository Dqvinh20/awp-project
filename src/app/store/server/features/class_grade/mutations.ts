import { useMutation, useQueryClient } from '@tanstack/react-query';

import ClassGradeService from '@/services/ClassGradeService';

export const useFinishedGrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['finished-grade'],
    mutationFn: ClassGradeService.finishClassGrade,
    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        predicate(query) {
          return (
            (query.queryKey[0] === 'class-grades' &&
              query.queryKey[1] === (variables as string)) ||
            (query.queryKey[0] === 'class' &&
              query.queryKey[1] === (variables as string))
          );
        },
      });
    },
  });
};

export const useUnFinishedGrade = () =>
  useMutation({
    mutationKey: ['unfinished-grade'],
    mutationFn: ClassGradeService.unfinishClassGrade,
  });

export const useUpdateGradeColumns = () =>
  useMutation({
    mutationKey: ['update-grade-col'],
    mutationFn: ClassGradeService.updateClassGradeColumns,
    retry: 3,
  });

export const useRemoveGradeRow = () =>
  useMutation({
    mutationKey: ['remove-grade-row'],
    mutationFn: ClassGradeService.removeGradeRow,
  });

export const useUpdateGradeRows = () =>
  useMutation({
    mutationKey: ['update-grade-rows'],
    mutationFn: ClassGradeService.updateStudentGrades,
  });
