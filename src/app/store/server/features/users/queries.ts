import { useMutation, useQuery } from '@tanstack/react-query';

import { User } from './interfaces';

import userService from '@/services/userService';

/**
 * Get user by id.
 * @param userId - User id.
 * @returns
 */
export const useGetUser = (userId?: string) =>
  useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    retry: false,
    enabled: !!userId,
  });
export const useUpdateUser = () =>
  useMutation<any>({
    mutationFn: async (data:any) => {
      return  await userService.saveUser(data?.userId,data.formdata)
    },
    retry: false,
});