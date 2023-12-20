import { SearchUserEmailParams } from './../app/store/server/features/users/interfaces';

import axiosClient from '@/app/AxiosClient';
import { User } from '@/app/store/server/features/users/interfaces';

/**
 * UserService.ts.
 * @description Service to call and get interact with user.
 * @author Vo Minh Thong <vmthong20@clc.fitus.edu.vn>
 */
const userService = {
  /**
   * Get user by id.
   * @param id - Get user.
   * @returns
   */
  async getUser(id?: string): Promise<User> {
    const response = await axiosClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async getAllUser(): Promise<User> {
    const response = await axiosClient.get<User>(`/users`);
    return response.data;
  },

  async searchEmails(params: SearchUserEmailParams) {
    const response = await axiosClient.get(`/users/search`, {
      params,
    });
    return response.data;
  },

  /**
   * Update user info.
   * @param id - User id.
   * @param data - User data.
   * @returns
   */
  async updateUser({ id, ...data }: User): Promise<any> {
    const response = await axiosClient.patch(`/users/${id}`, data);
    return response.data;
  },

  async getMyInfo(): Promise<User> {
    const response = await axiosClient.get<User>(`users/me`);
    return response.data;
  },
};

export default userService;
