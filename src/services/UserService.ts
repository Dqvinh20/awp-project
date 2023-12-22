import {
  CreateUserDTO,
  SearchUserEmailParams,
  ToggleBlockAccountDTO,
} from './../app/store/server/features/users/interfaces';

import axiosClient from '@/app/AxiosClient';
import { User } from '@/app/store/server/features/users/interfaces';

/**
 * UserService.ts.
 * @description Service to call and get interact with user.
 * @author Vo Minh Thong <vmthong20@clc.fitus.edu.vn>
 */
const userService = {
  /**
   * Create new user.
   * @param data - User data.
   * @returns
   */
  async create(data: CreateUserDTO): Promise<User> {
    const response = await axiosClient.post(`/users`, data);
    return response.data;
  },

  /**
   * Get user by id.
   * @param id - Get user.
   * @returns
   */
  async getUser(id?: string): Promise<User> {
    const response = await axiosClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async getAllUsers() {
    const response = await axiosClient.get(`/users`);
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

  async toggleBlockAccount({ userId, isActive }: ToggleBlockAccountDTO) {
    if (isActive) {
      const response = await axiosClient.get(`/users/${userId}/block`);
      return response.data;
    }

    const response = await axiosClient.get(`/users/${userId}/unblock`);
    return response.data;
  },
};

export default userService;
