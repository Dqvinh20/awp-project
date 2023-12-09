import axiosClient from '@/app/AxiosClient';
import { PaginationParams } from '@/interfaces/common.interface';

export const NotificationService = {
  async getNotifications(params?: PaginationParams) {
    const response = await axiosClient.get(`/notifications`, {
      params,
    });
    return response.data;
  },

  async countUnReadNotifications() {
    const response = await axiosClient.get<number>(
      `/notifications/unread/count`
    );
    return response.data;
  },

  async markRead(id: string) {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markRemove(id: string) {
    const response = await axiosClient.patch(`/notifications/${id}/remove`);
    return response.data;
  },
};
