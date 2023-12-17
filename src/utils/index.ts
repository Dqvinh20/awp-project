import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';
import { User } from '@/app/store/server/features/users/interfaces';

export function getFileNameFromContentDisposition(contentDisposition: string) {
  if (!contentDisposition) return null;

  const match = contentDisposition.match(/filename="?([^"]+)"?/);

  return match ? match[1] : null;
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const calcFinalGrade = (rows: any, cols: GradeColumn[]) => {
  const finalGrades = rows.map((row: any) => {
    const finalGrade = cols.reduce((acc, col) => {
      const grade = +row[col.name];
      const { scaleValue } = col;
      if (grade) {
        return acc + grade * scaleValue * 0.01;
      }
      return acc;
    }, 0);
    return {
      ...row,
      finalGrade,
    };
  });

  return finalGrades;
};

export const getUserFullNameOrEmail = (user: User) => {
  if (!user) return '';

  const { first_name, last_name, email } = user;

  if (first_name && last_name) {
    return `${first_name} ${last_name}`;
  }

  if (first_name && !last_name) {
    return first_name;
  }

  if (!first_name && last_name) {
    return last_name;
  }

  return email;
};
