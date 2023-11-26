import { useMutation } from '@tanstack/react-query';

import ClassRoomService from '@/services/ClassService';

/** Teacher add new class. */
export const useAddClass = () =>
  useMutation({
    mutationFn: ClassRoomService.addClassRoom,
    retry: false,
  });

/** User join the class. */
export const useJoinClass = () =>
  useMutation({
    mutationFn: ClassRoomService.joinClass,
    retry: false,
  });
