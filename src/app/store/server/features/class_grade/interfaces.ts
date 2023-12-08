import { ClassDTO } from '../classroom/interfaces';

export interface Grade {
  column: string;
  value: number;
}

export interface GradeRow {
  _id?: string;

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

// export interface GradeRow {}

export interface ClassGrade {
  class: ClassDTO;

  grade_columns: GradeColumn[];

  grade_rows: GradeRow[];

  isFinished: boolean;

  created_at?: string;

  updated_at?: string;

  deleted_at?: string;
}

export interface UpdateGradeColumnDTO {
  class_id: string;
  grade_columns: GradeColumn[];
}
