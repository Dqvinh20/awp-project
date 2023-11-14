import { useMutation, useQuery } from '@tanstack/react-query';

import { User } from './interfaces';

import userService from '@/services/userService';
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
    retry: false,
    enabled: !!userId,
  });

/**
 * Get current logged user's info.
 * @returns
 */
export const useGetMyInfo = () =>
  useQuery<User>({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMyInfo(),
    retry: false,
    enabled: !!jwtService.getToken(),
  });
