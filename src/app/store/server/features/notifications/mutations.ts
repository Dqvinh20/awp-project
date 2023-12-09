import { useMutation } from '@tanstack/react-query';

import { NotificationService } from '@/services/NotificationService';

export const useMarkReadNotification = () =>
  useMutation({
    mutationKey: ['notifications', 'read'],
    mutationFn: NotificationService.markRead,
  });
