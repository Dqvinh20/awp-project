import { Space, Spin } from 'antd';

import { useSearchParams } from 'react-router-dom';

import CreateRequestGradeReviewFAB from './button/CreateRequestGradeReviewFAB';
import StudentGradeReviewItem from './GradeReviewItem/StudentGradeReviewItem';

import TeacherGradeReviewItem from './GradeReviewItem/TeacherGradeReviewItem';

import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import {
  StudentGradeReviewDto,
  TeacherGradeReviewDto,
} from '@/app/store/server/features/grade_review/interfaces';
import useClassGradeReview from '@/hooks/useClassGradeReview';

function GradeReview() {
  const [searchParams] = useSearchParams();
  const defaultOpenReviewKey = searchParams.get('review');
  const {
    data,
    isSuccess: gradeReviewSuccess,
    isLoading: isGradeReviewLoading,
  } = useClassGradeReview();
  const hasData = data?.length > 0;

  const userRole = useUserRole();

  return (
    <div className="h-full w-full p-4">
      {userRole === USER_ROLE.Student && <CreateRequestGradeReviewFAB />}
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
          {userRole === USER_ROLE.Student
            ? data.map((gradeReview: StudentGradeReviewDto) => (
                <StudentGradeReviewItem
                  key={gradeReview.id}
                  {...gradeReview}
                  defaultOpenReviewKey={defaultOpenReviewKey}
                />
              ))
            : data.map((gradeReview: TeacherGradeReviewDto) => (
                <TeacherGradeReviewItem
                  key={gradeReview.id}
                  {...gradeReview}
                  defaultOpenReviewKey={defaultOpenReviewKey}
                />
              ))}
        </Space>
      )}
    </div>
  );
}

export default GradeReview;
