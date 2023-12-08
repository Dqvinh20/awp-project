import { useQuery } from '@tanstack/react-query';

import { ClassGrade } from './interfaces';

import ClassGradeService from '@/services/ClassGradeService';

export const useGetClassGrades = (
  classId?: string,
  select?: (class_grade: ClassGrade) => any
) =>
  useQuery({
    queryKey: ['class-grades', classId],
    queryFn: () => ClassGradeService.getClassGradesByClassID(classId),
    enabled: !!classId,
    select,
    // staleTime: 120000,
  });

export const useGetGradeColumns = (classId?: string) =>
  useQuery<ClassGrade>({
    queryKey: ['grade-columns', classId],
    queryFn: () => ClassGradeService.getClassGradeColumns(classId),
    enabled: !!classId,
    // staleTime: 120000,
  });
