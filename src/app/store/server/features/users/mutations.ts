import { useMutation, useQueryClient } from '@tanstack/react-query';

import userService from '@/services/UserService';

/** Update user mutation. */
export const useUpdateUser = () =>
  useMutation({
    mutationFn: userService.updateUser,
  });

/** Admin can toggle account block/unblock. */
export const useToggleBlockAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.toggleBlockAccount,
    onSuccess() {
      return queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
};

/** Admin can create account. */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess() {
      return queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
};

/** Admin can delete user account. */
export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess() {
      return queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
};
