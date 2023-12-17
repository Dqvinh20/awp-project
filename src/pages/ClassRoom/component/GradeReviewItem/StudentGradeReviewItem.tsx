import { CSSProperties, HTMLAttributes, memo, useState } from 'react';

import {
  App,
  Avatar,
  Badge,
  Card,
  Collapse,
  CollapseProps,
  Descriptions,
  DescriptionsProps,
  Divider,
  Flex,
  Input,
  Space,
  theme,
} from 'antd';

import { CaretRightOutlined, SendOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';

import { StudentGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import {
  GradeColumn,
  GradeRow,
} from '@/app/store/server/features/class_grade/interfaces';

import 'dayjs/locale/vi';
import { User } from '@/app/store/server/features/users/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useAddCommentMutation } from '@/app/store/server/features/grade_review/mutations';
import { classGradeReviewKey } from '@/app/store/server/features/grade_review/queries';

dayjs.locale('vi');
dayjs.extend(LocalizedFormat);

interface StudentGradeReviewItemProps
  extends Partial<StudentGradeReviewDto>,
    HTMLAttributes<HTMLDivElement> {
  gradeColumns?: GradeColumn[];
  gradeRows?: GradeRow[];
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

// eslint-disable-next-line max-lines-per-function
function StudentGradeReviewItem({
  id,
  gradeColumns = [],
  gradeRows = [],
  column: columnId,
  column_name,
  review_reason,
  expected_grade,
  current_grade,
  created_at,
  updated_at,
  isFinished,
  comments = [],
  ...rest
}: StudentGradeReviewItemProps) {
  const { id: classId } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const colName = gradeColumns.find((col) => col.id === columnId)?.name;
  const {
    data: myInfo,
    isLoading: isMyInfoLoading,
    isSuccess: isMyInfoSuccess,
  } = useGetMyInfo();
  const { mutate: addCommentMutate } = useAddCommentMutation();
  const [newComment, setNewComment] = useState('');

  const handleAddNewComment = () => {
    addCommentMutate(
      {
        grade_review_id: id ?? '',
        comment: newComment,
      },
      {
        onSuccess(data) {
          setNewComment('');
          message.success('New comment posted');
          return queryClient.invalidateQueries({
            queryKey: classGradeReviewKey(classId),
          });
        },
        onError() {
          message.error('Failed to post new comment');
        },
      }
    );
  };

  const label = (
    <div>
      <span className="text-base font-bold">Review Column: {colName}</span> •{' '}
      <span className="text-gray-500 font-thin">
        {dayjs(created_at).format('llll')}
      </span>
    </div>
  );

  const items1: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Current Grade',
      children: <span className="text-base">{current_grade}</span>,
    },
    {
      key: '2',
      label: 'Expected Grade',
      children: <span className="text-base">{expected_grade}</span>,
    },
    {
      key: '3',
      label: '',
      children: '',
    },
    {
      key: '4',
      label: 'Review Reason',
      children: <p className="twp text-base">{review_reason}</p>,
    },
  ];
  const children = (
    <div>
      <div className="flex flex-col justify-between">
        <Descriptions
          title="Grade Review Info"
          layout="vertical"
          size="small"
          items={items1}
        />
        <Divider className="bg-sky-500 m-0 my-2" />
        {/* Comments Section */}
        <div className="w-full">
          {comments.length !== 0 && (
            <div className="mb-2 text-base font-thin">
              Has {comments.length}{' '}
              {comments.length > 1 ? 'comments' : 'comment'} about this review
            </div>
          )}
          {comments.map(
            ({ _id, sender, comment, created_at: commentCreatedAt }) => {
              const { first_name, last_name, email, avatar } = sender as User;
              return (
                <Card.Meta
                  key={_id}
                  className="w-full px-2 mb-2 flex flex-row gap-x-4"
                  avatar={<Avatar src={avatar} />}
                  title={
                    <Space>
                      <span className="text-base font-semibold">
                        {`${first_name} ${last_name}`}
                      </span>
                      <span className="">
                        {dayjs(commentCreatedAt).format('L LT')}
                      </span>
                    </Space>
                  }
                  description={comment}
                />
              );
            }
          )}
        </div>
        {/* New Comment Section */}
        {isMyInfoSuccess && (
          <div className="w-full px-2 flex flex-row justify-center items-center gap-x-4">
            <Avatar src={myInfo?.avatar} />
            <Input
              className="!w-full rounded-full px-4 py-2 flex-1"
              placeholder="Add new comment"
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              onPressEnter={handleAddNewComment}
            />
            <button
              disabled={newComment.length === 0}
              onClick={handleAddNewComment}
              className="twp w-[32px] h-[32px] flex justify-center items-center rounded-full disabled:text-inherit disabled:bg-inherit disabled:opacity-100 disabled:cursor-not-allowed hover:text-sky-500 hover:bg-gray-300 hover:opacity-70"
            >
              <SendOutlined className="text-[16px] " />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const getItems: (
    panelStyle: React.CSSProperties
  ) => CollapseProps['items'] = (panelStyle) => [
    {
      key: colName,
      label,
      children,
      style: panelStyle,
    },
  ];

  const panelStyle: React.CSSProperties = {
    // marginBottom: 24,
    // background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <Badge.Ribbon
      text={isFinished ? 'Reviewed' : 'On Reviewing'}
      color={isFinished ? 'green' : ''}
    >
      <Collapse
        className="shadow-md hover:drop-shadow-lg bg-gray-100"
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        items={getItems(panelStyle)}
      />
    </Badge.Ribbon>
  );
}

export default memo(StudentGradeReviewItem);
