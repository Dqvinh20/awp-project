import { useEffect, useState } from 'react';

/**
 * Hook to check if the user is online or not.
 * @returns IsOnline.
 */
export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    /** Handle when user online. */
    function handleOnline() {
      setIsOnline(true);
    }
    /** Handle when user offline. */
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
