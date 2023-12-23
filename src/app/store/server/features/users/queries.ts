import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { SearchUserEmailParams, User, UserSearchResult } from './interfaces';

import userService from '@/services/UserService';

export const allUsersQueryKey = ['users'];

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
 * Get all users.
 * @returns
 */
export const useGetAllUsers = () =>
  useQuery<{ count: number; items: User[] }>({
    queryKey: allUsersQueryKey,
    queryFn: userService.getAllUsers,
  });

/**
 * Search for user emails.
 * @param email - Email to search for.
 * @param role - Role user to search for.
 * @returns
 */
export const useSearchEmails = <T = UserSearchResult>({
  email,
  role,
}: SearchUserEmailParams) =>
  useQuery<T>({
    queryKey: ['search', 'email', { email, role }],
    queryFn: () => userService.searchEmails({ email, role }),
    placeholderData: keepPreviousData,
    staleTime: 30000,
    gcTime: 30000,
  });

/**
 * Get current logged user's info.
 * @param select - Select data.
 * @returns
 */
export const useGetMyInfo = <TData = User>(select?: (data: User) => TData) =>
  useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMyInfo(),
    staleTime: 120000,
    select,
  });
