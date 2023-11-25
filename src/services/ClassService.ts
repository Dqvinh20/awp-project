import axiosClient from '@/app/AxiosClient';
import { ClassRoom, PaginationResult } from '@/app/store/server/features/classroom/interfaces';
var classListDemo: ClassRoom[] = [
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
    classListDemo: classListDemo,
  /**
   * Get All ClassRoom by user id.
   * @param userId user id
   * @returns
   */
  async getAllClassRoomByUserId(): Promise<PaginationResult<ClassRoom>> {
    const response = await axiosClient.get<PaginationResult<ClassRoom>>(`/classes`, {
      params: {
      },
    })
    return response.data;

    // console.log("getAllClassRoomByUserId")
    // console.log(this.classListDemo)
    // return await new Promise((res)=>{
    //     res(this.classListDemo)
    // });
  },

  async getClassDetail(classID:string): Promise<ClassRoom> {
    const response = await axiosClient.get<ClassRoom>(`/classes/${classID}`)
    return response.data;
  },

  /**
   * SaveClassRoom use To create or update.
   * @param id - ClassRoom id.
   * @param data - ClassRoom data.
   * @returns
   */
  async saveClassRoom(data?: object): Promise<any> {
    // const response = await axiosClient.post(`/classes`, data);
    this.classListDemo.push(
        {
            id: 'class7',
            code: 'Lớp THong là giáo viên',
            name: 'Lớp THong là giáo viên',
            owner: {
              id: 'user16',
              full_name: 'Quan THong Vinh',
              email: 'Dương Quang Vinh',
              avatar: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
            },
        },
    );
    
    return {
        success: true,
        message: "Create Class Success",
        classes: this.classListDemo
    }
    // return response.data;
  },
  async joinClass(params: object): Promise<ClassRoom> {
    const response = await axiosClient.get<ClassRoom>(`/classes/join`,{
      params: params
    })
    return response.data;
  },
};

export default ClassRoomService;
