import axiosClient from "@/api/AxiosClient";

/**
 * userService.ts.
 * @description service to call and get interact with user.
 * @author Vo Minh Thong <vmthong20@clc.fitus.edu.vn>
 */
const userService = {
  /**
   * get user by id.
   * @param id - get user.
   * @returns
   */
  async getUser(id: string): Promise<any> {
    const response: any = await axiosClient.get('/users/'+id);
    return response;
  },

  /**
   * saveUser.
   * @returns
   */
  async saveUser(id: string,data: object): Promise<any> {
    const response: any = await axiosClient.patch('/users/'+id,data);
    return response;
  },


};

export default userService;
