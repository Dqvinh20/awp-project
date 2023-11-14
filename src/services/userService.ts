import axiosClient from '@/app/AxiosClient';

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
  async getUser(id: string): Promise<any> {
    const response: any = await axiosClient.get(`/users/${id}`);
    return response;
  },

  /**
   * SaveUser.
   * @param id - User id.
   * @param data - User data.
   * @returns
   */
  async saveUser(id: string, data: object): Promise<any> {
    const response: any = await axiosClient.patch(`/users/${id}`, data);
    return response;
  },
};

export default userService;
