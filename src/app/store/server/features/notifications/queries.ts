import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  PaginationResult,
  PaginationParams,
  defaultPaginationParams,
} from './../../../../../interfaces/common.interface';

import { NotificationDTO } from './interfaces';

import { NotificationService } from '@/services/NotificationService';

export const useGetNotificationsInfinity = () =>
  useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }: { pageParam: PaginationParams }) =>
      NotificationService.getNotifications(pageParam),
    initialPageParam: {
      ...defaultPaginationParams,
      sort: '-created_at',
    } as PaginationParams,
    select(data: any) {
      return {
        pages: data.pages.flatMap(
          (x: PaginationResult<NotificationDTO>) => x.docs
        ),
        pageParams: [...data.pageParams],
      };
    },
    getNextPageParam(lastPage, _allPages, lastPageParam) {
      if (!lastPage.hasNextPage) {
        return undefined;
      }

      return {
        ...lastPageParam,
        page: lastPage.nextPage,
      };
    },
    getPreviousPageParam(firstPage, _allPages, firstPageParam) {
      if (!firstPage.hasPrevPage) {
        return undefined;
      }

      return {
        ...firstPageParam,
        page: firstPage.prevPage,
      };
    },
  });

export const useCountUnreadNotifications = () =>
  useQuery<number>({
    queryKey: ['notifications', 'unread', 'count'],
    queryFn: NotificationService.countUnReadNotifications,
  });
