import { App } from 'antd';
import { useEffect, useState } from 'react';

import useOnlineStatus from '@/hooks/useOnlineStatus';

function NetworkStatus() {
  const isOnline = useOnlineStatus();
  const [firstLoad, setFirstLoad] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    if (isOnline) {
      if (firstLoad) return;

      message.destroy();
      message.success("You're online", 2);
    } else {
      message.destroy();
      message.warning("You're offline", 2);
      setFirstLoad(false);
    }
  }, [isOnline, message]);

  return null;
}

export default NetworkStatus;
