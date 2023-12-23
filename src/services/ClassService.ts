import {
  AddClassDTO,
  InviteMembersByEmailDTO,
  KickMembersDTO,
  ToggleActiveClassDTO,
  UpdateClassDTO,
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

  async updateClassRoom(body: UpdateClassDTO): Promise<ClassDTO> {
    const { classId } = body;
    delete body.classId;
    const response = await axiosClient.patch(`/classes/${classId}`, body);
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

  async toggleClassActive({ classId, isActive }: ToggleActiveClassDTO) {
    if (isActive) {
      const response = await axiosClient.patch(`/classes/${classId}/deactive`);
      return response.data;
    }

    const response = await axiosClient.patch(`/classes/${classId}/active`);
    return response.data;
  },
};

export default ClassRoomService;

// function test gen list
// Function to generate a random string
// function generateRandomString(length: number) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

// // Function to generate NotificationDTO objects with random titles and messages
// function generateRandomNotificationArray(count: number) {
//   const result = [];

//   for (let i = 0; i < count; i++) {
//     const notification: NotificationDTO = {
//       title: generateRandomString(10), // Generate a random title
//       message: generateRandomString(20), // Generate a random message
//       created_at: new Date(),
//       updated_at: new Date(),
//     };

//     result.push(notification);
//   }

//   return result;
// }
