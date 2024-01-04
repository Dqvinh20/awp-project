import { Avatar, Divider, List, Skeleton, Tooltip } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { NotificationDTO } from '@/app/store/server/features/notifications/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';

dayjs.extend(relativeTime);

interface NotificationInfinityScrollProps {
  hasMore: boolean;
  data: NotificationDTO[];
  loadMoreData: () => void;
  handleOnClickNotification: (params: NotificationDTO) => void;
}

function NotificationInfinityScroll({
  data,
  hasMore,
  loadMoreData,
  handleOnClickNotification,
}: NotificationInfinityScrollProps) {
  const navigate = useNavigate();
  const { data: myID } = useGetMyInfo((user) => user.id);
  const unreadNotifications = useMemo(
    () =>
      data
        ?.filter(
          (notification: NotificationDTO) =>
            !notification.read_by?.some((read) => read.user.toString() === myID)
        )
        .map((notification: NotificationDTO) => notification.id) ?? [],
    [data, myID]
  );

  return (
    <InfiniteScroll
      className="rounded-lg shadow-lg bg-white w-[30rem]"
      style={{
        overflow: 'auto',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
      height={!hasMore && data && data.length < 4 ? 'auto' : 400}
      dataLength={data.length}
      next={loadMoreData}
      scrollThreshold={0.98}
      hasMore={hasMore}
      loader={
        <Skeleton className="p-4" avatar paragraph={{ rows: 1 }} active />
      }
      endMessage={
        data?.length > 0 && (
          <Divider plain>
            It is all, nothing more{' '}
            <span role="img" aria-label="emoji" aria-labelledby="emoji">
              🤐
            </span>
          </Divider>
        )
      }
    >
      <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50">
        Notifications
      </div>
      <List
        dataSource={data as NotificationDTO[]}
        renderItem={(item: NotificationDTO, index) => (
          <div
            key={`${item.title}-${index}`}
            style={{
              borderTop: '1px solid',
            }}
            className={`px-4 cursor-pointer !border-t-gray-300 hover:drop-shadow-md ${
              unreadNotifications.includes(item.id)
                ? 'bg-blue-50'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleOnClickNotification(item)}
          >
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      item.sender
                        ? item.sender.avatar
                        : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
                    }
                  />
                }
                title={
                  <Tooltip title={`View ${item.title}`} placement="topLeft">
                    <div className="line-clamp-1">{item.title}</div>
                  </Tooltip>
                }
                description={
                  <>
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: item.message ?? '',
                      }}
                    />
                    <div className="mt-2 text-xs text-blue-600">
                      {dayjs(item.created_at).fromNow()}
                    </div>
                  </>
                }
              />
            </List.Item>
          </div>
        )}
      />
    </InfiniteScroll>
  );
}

export default memo(NotificationInfinityScroll);
