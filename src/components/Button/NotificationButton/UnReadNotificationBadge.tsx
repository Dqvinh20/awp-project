import { Badge } from 'antd';
import { PropsWithChildren } from 'react';

import { useCountUnreadNotifications } from '@/app/store/server/features/notifications/queries';

function UnReadNotificationBadge({ children, ...rest }: PropsWithChildren) {
  const { data: unreadCount } = useCountUnreadNotifications();

  return (
    <Badge
      {...rest}
      className={unreadCount && unreadCount > 99 ? 'mr-2' : ''}
      count={unreadCount}
      overflowCount={99}
      color="#F84F31"
      offset={[0, 0]}
    >
      {children}
    </Badge>
  );
}

export default UnReadNotificationBadge;
