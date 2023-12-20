import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router';

import ClassRoomService from '@/services/ClassService';

/** Teacher add new class. */
export const useAddClass = () =>
  useMutation({
    mutationKey: [useAddClass.name],
    mutationFn: ClassRoomService.addClassRoom,
  });

/** Teacher update class. */
export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const { id: classId } = useParams();
  if (!classId) throw new Error('Class id is required');

  return useMutation({
    mutationKey: [useUpdateClass.name],
    mutationFn: ClassRoomService.updateClassRoom,
    onSuccess() {
      return queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
  });
};
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

/** Admin can toggle class active. */
export const useToggleClassActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ClassRoomService.toggleClassActive,
    onSuccess() {
      return queryClient.invalidateQueries({
        queryKey: ['classes'],
      });
    },
  });
};
