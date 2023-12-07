import { useMutation } from '@tanstack/react-query';

import ClassGradeService from '@/services/ClassGradeService';

export const useFinishedGrade = () =>
  useMutation({
    mutationKey: ['finished-grade'],
    mutationFn: ClassGradeService.finishClassGrade,
  });

export const useUnFinishedGrade = () =>
  useMutation({
    mutationKey: ['unfinished-grade'],
    mutationFn: ClassGradeService.unfinishClassGrade,
  });
