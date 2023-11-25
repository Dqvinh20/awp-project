import { useMutation } from '@tanstack/react-query';

import ClassRoomService from '@/services/ClassService';

/** Teacher add new class. */
export const useAddClass = () =>
  useMutation({
    mutationFn: ClassRoomService.addClassRoom,
    retry: false,
  });
