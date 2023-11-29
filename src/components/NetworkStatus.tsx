import { App } from 'antd';
import { useEffect } from 'react';

import useOnlineStatus from '@/hooks/useOnlineStatus';

let isFirstLoad = true;

function NetworkStatus() {
  const isOnline = useOnlineStatus();
  const { message } = App.useApp();

  useEffect(() => {
    if (isOnline) {
      if (isFirstLoad) return;

      message.destroy();
      message.success("You're online", 2);
    } else {
      message.destroy();
      message.warning("You're offline", 2);
      isFirstLoad = false;
    }
  }, [isOnline, message]);

  return null;
}

export default NetworkStatus;
