import { AddClassDTO } from './../app/store/server/features/classroom/interfaces';
import {
  PaginationParams,
  defaultPaginationParams,
} from './../interfaces/common.interface';

import axiosClient from '@/app/AxiosClient';
import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';
import { PaginationResult } from '@/interfaces/common.interface';

const classListDemo: ClassDTO[] = [
  {
    id: 'class1',
    code: 'Lớp Vinh là giáo viên',
    name: 'Lớp Vinh là giáo viên',
    owner: {
      id: 'user1',
      full_name: 'Dương Quang Vinh',
      email: 'Dương Quang Vinh',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
  {
    id: 'class2',
    code: 'Lớp Qui Bu',
    name: 'Lớp Qui Bu',
    owner: {
      id: 'user2',
      email: 'Dương Quang Vinh',
      full_name: 'Vo Minh Thong',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
  {
    id: 'class3',
    code: 'Lớp Nghien Ngap',
    name: 'Lớp Nghien Ngap',
    owner: {
      id: 'user3',
      email: 'Dương Quang Vinh',
      full_name: 'Quan',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
  {
    id: 'class4',
    code: 'Lớp Vinh là giáo viên',
    name: 'Lớp Vinh là giáo viên',
    owner: {
      id: 'user1',
      full_name: 'Dương Quang Vinh',
      email: 'Dương Quang Vinh',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
  {
    id: 'class5',
    code: 'Lớp Qui Bu',
    name: 'Lớp Qui Bu',
    owner: {
      id: 'user2',
      email: 'Dương Quang Vinh',
      full_name: 'Vo Minh Thong',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
  {
    id: 'class6',
    code: 'Lớp Nghien Ngap',
    name: 'Lớp Nghien Ngap',
    owner: {
      id: 'user3',
      email: 'Dương Quang Vinh',
      full_name: 'Quan',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    },
  },
];

/**
 * ClassRoomService.ts.
 * @description Service to call and get interact with ClassRoom.
 * @author Vo Minh Thong <vmthong20@clc.fitus.edu.vn>
 */
const ClassRoomService = {
  classListDemo,

  async addClassRoom(body?: AddClassDTO): Promise<ClassDTO> {
    const response = await axiosClient.post(`/classes`, body);
    return response.data;
    // this.classListDemo.push({
    //   id: 'class7',
    //   code: 'Lớp THong là giáo viên',
    //   name: 'Lớp THong là giáo viên',
    //   owner: {
    //     id: 'user16',
    //     full_name: 'Quan THong Vinh',
    //     email: 'Dương Quang Vinh',
    //     avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    //   },
    // });

    // return {
    //   success: true,
    //   message: 'Create Class Success',
    //   classes: this.classListDemo,
    // };
    // return response.data;
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

    // console.log("getAllClassRoomByUserId")
    // console.log(this.classListDemo)
    // return await new Promise((res)=>{
    //     res(this.classListDemo)
    // });
  },

  async getClassDetail(classID: string): Promise<ClassDTO> {
    const response = await axiosClient.get<ClassDTO>(`/classes/${classID}`);
    return response.data;
  },
};

export default ClassRoomService;
