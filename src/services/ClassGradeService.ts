import {
  UpdateGradeColumnsDTO,
  UpdateGradeRowsDTO,
} from './../app/store/server/features/class_grade/interfaces';

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

  getGradeTemplate({
    classId,
    file_type = 'xlsx',
  }: {
    classId: string;
    file_type?: string;
  }) {
    return axiosClient.get(`/class-grades/${classId}/template`, {
      responseType: 'blob',
      params: {
        file_type,
      },
    });
  },

  importGradeBoard({ classId, file }: { classId: string; file: File }) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/class-grades/${classId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  exportGradeBoard({
    classId,
    file_type = 'xlsx',
  }: {
    classId: string;
    file_type?: string;
  }) {
    return axiosClient.get(`/class-grades/${classId}/export`, {
      responseType: 'blob',
      params: {
        file_type,
      },
    });
  },

  async updateStudentGrades({ classId, grade_rows }: UpdateGradeRowsDTO) {
    const res = await axiosClient.patch(`/class-grades/${classId}/rows`, {
      grade_rows,
    });
    return res.data;
  },

  async removeGradeRow({ classId, rowId }: { classId: string; rowId: string }) {
    const res = await axiosClient.delete(
      `/class-grades/${classId}/rows/${rowId}`
    );
    return res.data;
  },

  async getClassGradeColumns(classId?: string) {
    const res = await axiosClient.get(`/class-grades/${classId}/columns`);
    return res.data;
  },

  async updateClassGradeColumns({
    class_id,
    grade_columns,
  }: UpdateGradeColumnsDTO) {
    const res = await axiosClient.post(`/class-grades/${class_id}/columns`, {
      grade_columns,
    });
    return res.data;
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
