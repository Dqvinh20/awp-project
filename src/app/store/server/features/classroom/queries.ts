import ClassRoomService from '@/services/ClassService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClassRoom, PaginationResult } from './interfaces';

/**
 * Get user by id.
 * @param userId - User id.
 * @returns
 */
export const useClassRoomByUserId = (userId?: string) =>
  useQuery<PaginationResult<ClassRoom>>({
    queryKey: ['classes'],
    queryFn: () => ClassRoomService.getAllClassRoomByUserId(userId || ''),
    retry: false,
  });


  

