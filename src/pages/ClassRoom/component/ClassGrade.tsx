import { Space, Spin } from 'antd';

import { useParams } from 'react-router';

import { AxiosError } from 'axios';

import GradeTable from './tables/GradeTable/GradeTable';

import ToggleFinishGradeFAB from './button/ToggleFinishGradeFAB';

import CreateRequestGradeReviewFAB from './button/CreateRequestGradeReviewFAB';

import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

export default function ClassGrade() {
  const { id: class_id } = useParams();
  const {
    data: classGrades,
    isLoading: classGradesLoading,
    isSuccess,
    isError,
    error,
  } = useGetClassGrades(class_id);
  const userRole = useUserRole();

  const renderError = () => {
    if (error instanceof AxiosError) {
      const message = error?.response?.data?.message;
      if (message === 'You are not allowed to view this class grade') {
        return (
          <div className="twp text-center flex items-center justify-center h-full">
            <p className="text-xl font-medium">
              Teacher is not finished with the grade
            </p>
          </div>
        );
      }
    }
  };

  const hasRows = classGrades?.grade_rows?.length > 0;

  return (
    <div className="antialiased p-4 h-full">
      {classGradesLoading && (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      )}

      {isSuccess && (
        <>
          <GradeTable
            rows={classGrades?.grade_rows}
            columns={classGrades?.grade_columns}
            isLoading={classGradesLoading}
            isTeacher={userRole === USER_ROLE.Teacher}
          />
          {hasRows && (
            <>
              {userRole === USER_ROLE.Student && (
                <CreateRequestGradeReviewFAB />
              )}
              {userRole === USER_ROLE.Teacher && <ToggleFinishGradeFAB />}
            </>
          )}
        </>
      )}
      {isError && renderError()}
    </div>
  );
}
