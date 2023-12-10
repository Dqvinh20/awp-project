import { ClassDTO } from '../classroom/interfaces';

export interface Grade {
  column: string;
  value: number;
}

export interface GradeRow {
  id?: string;
  student: string;
  student_id: string;
  full_name: string;
  grades: Grade[];
}

export interface GradeColumn {
  id?: string;
  name: string;
  ordinal: number;
  scaleValue: number;
}

export interface ClassGrade {
  class: ClassDTO;

  grade_columns: GradeColumn[];

  grade_rows: GradeRow[];

  isFinished: boolean;

  created_at?: string;

  updated_at?: string;

  deleted_at?: string;
}

export interface UpdateGradeColumnsDTO {
  class_id: string;
  grade_columns: GradeColumn[];
}

export interface UpdateGradeRowsDTO {
  classId: string;
  grade_rows: GradeRow[];
}
