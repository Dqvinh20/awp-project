import { ClassDTO } from '../classroom/interfaces';
import { User } from '../users/interfaces';

export interface CreateGradeReviewDto {
  class: string;
  column: string;
  review_reason: string;
  expected_grade: number;
}

export interface AddCommentDto {
  grade_review_id: string;
  comment: string;
}

export interface FinishGradeReviewDto {
  grade_review_id: string;
}

export interface CommentDto {
  id?: string;
  _id?: string;

  comment: string;
  sender: string | Partial<User>;
  created_at: string;
  updated_at: string;
}

export interface BaseGradeReviewDto {
  id?: string;
  class: string | ClassDTO;
  column: string;
  column_name: string;
  review_reason: string;
  expected_grade: number;
  current_grade: number;
  request_student: string | User;
  request_student_id: string;
  isFinished: boolean;
  comments: CommentDto[];
  created_at: string;
  updated_at: string;
}

export type StudentGradeReviewDto = BaseGradeReviewDto;

export interface TeacherGradeReviewDto extends BaseGradeReviewDto {
  current_grade: number;
}
