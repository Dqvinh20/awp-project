import { useParams } from 'react-router-dom';

import { Space, Spin } from 'antd';

import CreateRequestGradeReview from './button/CreateRequestGradeReview';
import StudentGradeReviewItem from './GradeReviewItem/StudentGradeReviewItem';

import { useClassGradeReview } from '@/app/store/server/features/grade_review/queries';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';

function GradeReview() {
  const { id: classId } = useParams<{ id: string }>();
  const {
    data,
    isSuccess: gradeReviewSuccess,
    isLoading: isGradeReviewLoading,
  } = useClassGradeReview(classId);
  const { data: classGrade } = useGetClassGrades(classId);
  const hasData = data?.length > 0;

  const userRole = useUserRole();

  return (
    <div className="h-screen-dvh w-full p-4  mb-52">
      <CreateRequestGradeReview />
      {isGradeReviewLoading && (
        <div className="flex justify-center items-center h-full">
          <Spin />
        </div>
      )}
      {gradeReviewSuccess && !hasData && (
        <div className="flex justify-center items-center h-full">
          <div className="text-2xl">No grade review was made</div>
        </div>
      )}
      {gradeReviewSuccess && (
        <Space direction="vertical" className="w-full">
          {userRole === USER_ROLE.Student &&
            data.map((gradeReview: any) => (
              <StudentGradeReviewItem
                key={gradeReview.id}
                {...gradeReview}
                gradeColumns={classGrade?.grade_columns}
                gradeRows={classGrade?.grade_rows}
              />
            ))}
        </Space>
      )}
    </div>
  );
}

export default GradeReview;
