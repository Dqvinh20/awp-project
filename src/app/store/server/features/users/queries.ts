import { useQuery } from '@tanstack/react-query';

import { User } from './interfaces';

import userService from '@/services/UserService';
import jwtService from '@/services/JwtService';

/**
 * Get user by id.
 * @param userId - User id.
 * @returns
 */
export const useGetUser = (userId?: string) =>
  useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    enabled: !!userId,
  });

/**
 * Get current logged user's info.
 * @param select - Select data.
 * @returns
 */
export const useGetMyInfo = (select?: (data: User) => any) =>
  useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMyInfo(),
    retry: false,
    enabled: !!jwtService.getToken(),
    staleTime: 120000,
    select,
  });
