import { ClassDTO } from '../classroom/interfaces';
import { User } from '../users/interfaces';

export interface CreateGradeReviewDto {
  class: string;
  column: string;
  review_reason: string;
  expected_grade: number;
}

export interface BaseGradeReviewDto {
  id?: string;
  class: string | ClassDTO;
  column: string;
  review_reason: string;
  expected_grade: number;
  request_student: string | User;
  request_student_id: string;
  created_at: string;
  updated_at: string;
}

export type StudentGradeReviewDto = BaseGradeReviewDto;

export interface TeacherGradeReviewDto extends BaseGradeReviewDto {
  current_grade: number;
}
