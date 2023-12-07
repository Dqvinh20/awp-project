import { useMutation } from '@tanstack/react-query';

import ClassRoomService from '@/services/ClassService';

/** Teacher add new class. */
export const useAddClass = () =>
  useMutation({
    mutationFn: ClassRoomService.addClassRoom,
  });

/** User join the class. */
export const useJoinClass = () =>
  useMutation({
    mutationFn: ClassRoomService.joinClass,
  });

/** Owner kick students or teacher out class. */
export const useKickMembers = () =>
  useMutation({
    mutationFn: ClassRoomService.kickMembers,
  });

/** User can leave a class. */
export const useLeaveClass = () =>
  useMutation({
    mutationFn: ClassRoomService.leaveClass,
  });
