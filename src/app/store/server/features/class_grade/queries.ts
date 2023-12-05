import { useQuery } from '@tanstack/react-query';

import { ClassGrade } from './interfaces';

import ClassGradeService from '@/services/ClassGradeService';

export const useGetClassGrades = (classId?: string) =>
  useQuery<ClassGrade>({
    queryKey: ['class-grades', classId],
    queryFn: () => ClassGradeService.getClassGradesByClassID(classId),
    retry: 1,
    enabled: !!classId,
    // staleTime: 120000,
  });

export const useGetGradeColumns = (classId?: string) =>
  useQuery<ClassGrade>({
    queryKey: ['grade-columns', classId],
    queryFn: () => ClassGradeService.getClassGradeColumns(classId),
    retry: false,
    enabled: !!classId,
    // staleTime: 120000,
  });
