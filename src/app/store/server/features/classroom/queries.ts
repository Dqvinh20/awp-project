import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ClassDTO } from './interfaces';

import ClassRoomService from '@/services/ClassService';
import {
  PaginationParams,
  PaginationResult,
  defaultPaginationParams,
} from '@/interfaces/common.interface';

/**
 * Get all class that user belong to.
 * @param params Pagination params.
 * @returns
 */
export const useClassesQuery = (
  params: PaginationParams = defaultPaginationParams
) =>
  useQuery<PaginationResult<ClassDTO>>({
    queryKey: ['classes', params],
    queryFn: () => ClassRoomService.getAllClasses(params),
    retry: false,
    placeholderData: keepPreviousData,
  });

/**
 * @param classId Class ID.
 * @returns Class detail info.
 */
export const useClassDetailQuery = (classId: string) =>
  useQuery<ClassDTO>({
    queryKey: ['class', classId],
    queryFn: () => ClassRoomService.getClassDetail(classId),
    retry: false,
  });
