import { useMutation, useQueryClient } from '@tanstack/react-query';

import userService from '@/services/UserService';

/** Update user mutation. */
export const useUpdateUser = () =>
  useMutation({
    mutationFn: userService.updateUser,
  });

/** Admin can toggle class active. */
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
