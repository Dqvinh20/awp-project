import { Collapse, Space, Spin } from 'antd';

import groupBy from 'lodash/groupBy';

import { Dictionary } from 'lodash';

import TeacherGradeReviewItem from '../ClassRoom/component/GradeReviewItem/TeacherGradeReviewItem';

import { useAllGradeReviewsQuery } from '@/app/store/server/features/grade_review/queries';
import { TeacherGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';
import DocumentTitle from '@/components/DocumentTitle';

function PendingReviews() {
  const {
    data,
    isLoading: listLoading,
    isSuccess: listSuccess,
  } = useAllGradeReviewsQuery();

  const groupByClass = groupBy<TeacherGradeReviewDto>(data, 'class.id');
  const hasData = Object.keys(groupByClass).length > 0;

  const renderReviews = (
    pending_reviews: Dictionary<TeacherGradeReviewDto[]>
  ) =>
    Object.keys(pending_reviews).map((classId) => {
      const className = (pending_reviews[classId][0].class as ClassDTO).name;
      const item = [
        {
          key: classId,
          label: (
            <div className="text-base antialiased font-semibold">
              Class Name: {className}
            </div>
          ),
          children: (
            <Space direction="vertical" className="w-full">
              {pending_reviews[classId].map((gradeReview) => (
                <TeacherGradeReviewItem key={gradeReview.id} {...gradeReview} />
              ))}
            </Space>
          ),
        },
      ];

      return <Collapse key={classId} defaultActiveKey={classId} items={item} />;
    });

  return (
    <>
      <DocumentTitle title={'Pending Reviews'} />
      <div className="h-full w-full flex justify-center items-start p-6">
        {listLoading && <Spin />}
        {listSuccess && !hasData && (
          <div className="flex justify-center items-center h-full">
            <div className="text-2xl">No grade reviews</div>
          </div>
        )}
        {listSuccess && (
          <Space direction="vertical" className="w-full">
            {renderReviews(groupByClass ?? [])}
          </Space>
        )}
      </div>
    </>
  );
}

export default PendingReviews;
