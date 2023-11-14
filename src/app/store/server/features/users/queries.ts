import { useQuery } from '@tanstack/react-query';

import { User } from './interfaces';

import userService from '@/services/UserService';

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
