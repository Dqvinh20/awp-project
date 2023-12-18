import { Dropdown, Spin } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import UnReadNotificationBadge from './UnReadNotificationBadge';
import NotificationInfinityScroll from './NotificationInfinityScroll';
import BellButton from './BellButton';

import {
  useCountUnreadNotifications,
  useGetNotificationsInfinity,
} from '@/app/store/server/features/notifications/queries';
import { NotificationDTO } from '@/app/store/server/features/notifications/interfaces';
import { useMarkReadNotification } from '@/app/store/server/features/notifications/mutations';
import { useNotificationsStore } from '@/app/store/client/notifications/store';

function NotificationButton() {
  const navigate = useNavigate();
  const markRead = useMarkReadNotification();
  const notificationsStore = useNotificationsStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch: notificationsRefetch,
  } = useGetNotificationsInfinity();
  const { data: unreadCount, refetch: uncountRefetch } =
    useCountUnreadNotifications();
  const setNotifOpen = useNotificationsStore((state) => state.setOpen);

  const loadMoreData = useCallback(() => {
    if (isFetchingNextPage) {
      return;
    }
    fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage]);

  const handleOnClickNotification = useCallback(
    ({ ref_url, id }: NotificationDTO) => {
      try {
        markRead.mutateAsync(id!, {
          onSuccess() {
            uncountRefetch();
            notificationsRefetch();
          },
        });
      } catch (error) {
        /* EMPTY */
      } finally {
        setNotifOpen(false);
        if (ref_url) {
          navigate(ref_url);
        }
      }
    },
    [markRead, navigate, notificationsRefetch, setNotifOpen, uncountRefetch]
  );

  const dataSource = useMemo(() => data?.pages ?? [], [data]);

  const renderDropDown = useCallback(() => {
    if (status === 'pending') {
      return <Spin />;
    }

    if (status === 'error') {
      return (
        <div className="p-4 max-w-sm">
          Can't get notifications. Please try again later.
        </div>
      );
    }

    return (
      <NotificationInfinityScroll
        data={dataSource}
        hasMore={!!hasNextPage}
        loadMoreData={loadMoreData}
        handleOnClickNotification={handleOnClickNotification}
      />
    );
  }, [
    dataSource,
    handleOnClickNotification,
    hasNextPage,
    loadMoreData,
    status,
  ]);

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <Dropdown
      open={notificationsStore.open}
      onOpenChange={(open) => {
        notificationsStore.setOpen(open);
      }}
      overlayClassName="!mt-12"
      trigger={['click']}
      destroyPopupOnHide
      placement="bottomRight"
      dropdownRender={() => renderDropDown()}
    >
      <UnReadNotificationBadge
        className={unreadCount && unreadCount > 99 ? 'mr-2' : ''}
        count={unreadCount}
      >
        <BellButton />
      </UnReadNotificationBadge>
    </Dropdown>
  );
}

export default NotificationButton;
