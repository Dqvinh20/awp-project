import { useMutation } from '@tanstack/react-query';

import userService from '@/services/UserService';

/** Update user mutation. */
export const useUpdateUser = () =>
  useMutation({
    mutationFn: userService.updateUser,
  });
