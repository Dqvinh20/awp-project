import { Badge } from 'antd';
import { PropsWithChildren, memo } from 'react';

function UnReadNotificationBadge({
  children,
  className,
  count,
  ...rest
}: PropsWithChildren & {
  count?: number;
  className?: string;
}) {
  return (
    <Badge
      {...rest}
      className={className}
      count={count}
      overflowCount={99}
      color="#F84F31"
      offset={[0, 0]}
    >
      {children}
    </Badge>
  );
}

export default memo(UnReadNotificationBadge);
