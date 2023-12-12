import {
  AddClassDTO,
  InviteMembersByEmailDTO,
  KickMembersDTO,
} from './../app/store/server/features/classroom/interfaces';
import {
  PaginationParams,
  defaultPaginationParams,
} from './../interfaces/common.interface';

import axiosClient from '@/app/AxiosClient';
import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';
import { PaginationResult } from '@/interfaces/common.interface';

/**
 * ClassRoomService.ts.
 * @description Service to call and get interact with ClassRoom.
 * @author Vo Minh Thong <vmthong20@clc.fitus.edu.vn>
 */
const ClassRoomService = {
  async addClassRoom(body?: AddClassDTO): Promise<ClassDTO> {
    const response = await axiosClient.post(`/classes`, body);
    return response.data;
  },

  async getAllClasses(
    params?: PaginationParams
  ): Promise<PaginationResult<ClassDTO>> {
    const response = await axiosClient.get<PaginationResult<ClassDTO>>(
      `/classes`,
      {
        params: {
          ...defaultPaginationParams,
          ...params,
        },
      }
    );
    return response.data;
  },

  async getClassDetail(classID: string): Promise<ClassDTO> {
    const response = await axiosClient.get<ClassDTO>(`/classes/${classID}`);
    return response.data;
  },

  async inviteMembers(body: InviteMembersByEmailDTO): Promise<ClassDTO> {
    const response = await axiosClient.post<ClassDTO>(
      `/classes/send-link-to-email`,
      body
    );
    return response.data;
  },

  async joinClass(params: object): Promise<ClassDTO> {
    const response = await axiosClient.get<ClassDTO>(`/classes/join`, {
      params,
    });
    return response.data;
  },

  async removeMembers(data: KickMembersDTO) {
    const response = await axiosClient.delete(`/classes/kick`, {
      data,
    });
    return response.data;
  },

  async leaveClass(classId: string) {
    const response = await axiosClient.delete(`/classes/${classId}/leave`);
    return response.data;
  },
};

export default ClassRoomService;
