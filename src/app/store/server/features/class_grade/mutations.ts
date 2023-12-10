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
