import { Dropdown, Spin } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import UnReadNotificationBadge from './UnReadNotificationBadge';
import NotificationInfinityScroll from './NotificationInfinityScroll';
import BellButton from './BellButton';

import { useGetNotificationsInfinity } from '@/app/store/server/features/notifications/queries';
import { NotificationDTO } from '@/app/store/server/features/notifications/interfaces';
import { useMarkReadNotification } from '@/app/store/server/features/notifications/mutations';

function NotificationButton() {
  const navigate = useNavigate();
  const markRead = useMarkReadNotification();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useGetNotificationsInfinity();

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
            refetch();
          },
        });
      } catch (error) {
        /* EMPTY */
      } finally {
        if (ref_url) {
          navigate(ref_url);
        }
      }
    },
    [markRead, navigate, refetch]
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
      overlayClassName="!mt-12"
      trigger={['click']}
      placement="bottomRight"
      dropdownRender={() => renderDropDown()}
    >
      <UnReadNotificationBadge>
        <BellButton />
      </UnReadNotificationBadge>
    </Dropdown>
  );
}

export default NotificationButton;
