import {
  AddCommentDto,
  CreateGradeReviewDto,
} from './../app/store/server/features/grade_review/interfaces';

import axiosClient from '@/app/AxiosClient';

const GradeReviewService = {
  async createNewGradeReview(gradeReview: CreateGradeReviewDto) {
    const res = await axiosClient.post('/grade-review', gradeReview);
    return res.data;
  },

  async getDetailGradeReview(gradeReviewId: string) {
    const res = await axiosClient.get(`/grade-review/${gradeReviewId}`);
    return res.data;
  },

  async getAllGradeReviews() {
    const res = await axiosClient.get('/grade-review');
    return res.data;
  },

  async getAllGradeReviewsByClass(classId?: string) {
    const res = await axiosClient.get(`/grade-review/class/${classId}`);
    return res.data;
  },

  async addComment({ grade_review_id, comment }: AddCommentDto) {
    const res = await axiosClient.post(
      `/grade-review/${grade_review_id}/comment`,
      { comment }
    );
    return res.data;
  },
};

export default GradeReviewService;
