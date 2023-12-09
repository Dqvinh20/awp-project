import { useCallback, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router';
import { App } from 'antd';

import { useUserRole } from './useUserRole';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { WebSocketContext, retryConnect } from '@/contexts/WebSocketContext.';

import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { NotificationDTO } from '@/app/store/server/features/notifications/interfaces';
import { useMarkReadNotification } from '@/app/store/server/features/notifications/mutations';

export const useSocketNotification = () => {
  const socket = useContext(WebSocketContext);
  const { data: myId } = useGetMyInfo((user) => user.id);
  const userRole = useUserRole();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const markRead = useMarkReadNotification();
  const queryClient = useQueryClient();

  const handleOnClickNotification = useCallback(
    ({ ref_url, id, class: class_id }: NotificationDTO) => {
      try {
        markRead.mutateAsync(id!, {
          onSuccess() {
            return queryClient.invalidateQueries({
              predicate: (query: any) =>
                query.queryKey[0] === 'notifications' ||
                (query.queryKey[0] === 'class-grades' &&
                  query.queryKey[1] === class_id),
            });
          },
        });
      } catch (error) {
        /* EMPTY */
      } finally {
        if (ref_url) {
          navigate(ref_url);
        }
        notification.destroy(id);
      }
    },
    [markRead, navigate, notification, queryClient]
  );

  useEffect(() => {
    const studentEvents = {
      registering() {
        socket.on('grade.unfinished', ({ class_id }: { class_id: string }) => {
          queryClient.invalidateQueries({
            predicate: (query: any) =>
              query.queryKey[0] === 'notifications' ||
              (query.queryKey[0] === 'class-grades' &&
                query.queryKey[1] === class_id),
          });
        });

        socket.on(
          'grade.finished',
          ({
            class: class_id,
            title,
            message,
            ref_url,
            id,
            ...rest
          }: NotificationDTO) => {
            queryClient.invalidateQueries({
              predicate: (query: any) =>
                query.queryKey[0] === 'notifications' ||
                (query.queryKey[0] === 'class-grades' &&
                  query.queryKey[1] === class_id),
            });
            notification.success({
              key: id,
              className: 'cursor-pointer',
              message: title,
              description: message,
              onClick: () =>
                handleOnClickNotification({
                  ref_url,
                  class: class_id,
                  id,
                  title,
                  ...rest,
                }),
            });
          }
        );
      },

      unregistering() {
        socket.off('grade.unfinished');
        socket.off('grade.finished');
      },
    };

    socket.connect();
    socket.on('connect', () => {
      socket.emit('join', myId);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        retryConnect(socket);
      }
    });

    if (userRole === USER_ROLE.Student) {
      studentEvents.registering();
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');

      if (userRole === USER_ROLE.Student) {
        studentEvents.unregistering();
      }
    };
  }, [myId, queryClient, socket, userRole]);
};
