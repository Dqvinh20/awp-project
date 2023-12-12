import { useMutation } from '@tanstack/react-query';

import ClassRoomService from '@/services/ClassService';

/** Teacher add new class. */
export const useAddClass = () =>
  useMutation({
    mutationKey: [useAddClass.name],
    mutationFn: ClassRoomService.addClassRoom,
  });

/** Invite members to class. */
export const useInviteMembers = () =>
  useMutation({
    mutationKey: [useInviteMembers.name],
    mutationFn: ClassRoomService.inviteMembers,
  });

/** User join the class. */
export const useJoinClass = () =>
  useMutation({
    mutationKey: [useJoinClass.name],
    mutationFn: ClassRoomService.joinClass,
  });

/** Owner kick students or teacher out class. */
export const useRemoveMembers = () =>
  useMutation({
    mutationKey: [useRemoveMembers.name],
    mutationFn: ClassRoomService.removeMembers,
  });

/** User can leave a class. */
export const useLeaveClass = () =>
  useMutation({
    mutationFn: ClassRoomService.leaveClass,
  });
