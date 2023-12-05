import axiosClient from '@/app/AxiosClient';

const ClassGradeService = {
  async getClassGrades() {
    const res = await axiosClient.get('/class-grades');
    return res.data;
  },

  async getClassGradesByClassID(classId?: string) {
    const res = await axiosClient.get(`/class-grades/${classId}`);
    return res.data;
  },

  updateStudentGrade({ classId }: { classId: string }) {
    return axiosClient.patch(`/class-grades/${classId}`);
  },

  async getClassGradeColumns(classId?: string) {
    const res = await axiosClient.get(`/class-grades/${classId}/columns`);
    return res.data;
  },

  upsertClassGradeColumns({ classId }: { classId: string }) {
    return axiosClient.post(`/class-grades/${classId}/columns`);
  },

  async finishClassGrade(classId?: string) {
    const res = await axiosClient.patch(`/class-grades/${classId}/finish`);
    return res.data;
  },

  async unfinishClassGrade(classId?: string) {
    const res = await axiosClient.patch(`/class-grades/${classId}/unfinish`);
    return res.data;
  },
};

export default ClassGradeService;
