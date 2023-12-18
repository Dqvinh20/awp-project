import { Space, Spin } from 'antd';

import { useParams } from 'react-router';

import { AxiosError } from 'axios';

import GradeTable from './tables/GradeTable/GradeTable';

import ToggleFinishGradeButton from './button/ToggleFinishGradeButton';

import CreateRequestGradeReview from './button/CreateRequestGradeReview';

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
    ...rests
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
          {userRole === USER_ROLE.Student && <CreateRequestGradeReview />}
          {userRole === USER_ROLE.Teacher && (
            <div className="mt-4 mb-10 flex justify-end">
              <Space>
                <ToggleFinishGradeButton />
              </Space>
            </div>
          )}
        </>
      )}
      {isError && renderError()}
    </div>
  );
}
