/* eslint-disable max-lines-per-function */
import { HTMLAttributes, memo, useState } from 'react';

import {
  CaretRightOutlined,
  CheckOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {
  DescriptionsProps,
  Descriptions,
  Divider,
  Card,
  Avatar,
  Space,
  Input,
  CollapseProps,
  App,
  theme,
  Badge,
  Collapse,
  Button,
  Tooltip,
} from 'antd';

import dayjs from 'dayjs';

import { useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { TeacherGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import { User } from '@/app/store/server/features/users/interfaces';

import {
  useAddCommentMutation,
  useFinishGradeReviewMutation,
} from '@/app/store/server/features/grade_review/mutations';
import { classGradeReviewKey } from '@/app/store/server/features/grade_review/queries';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { getUserFullNameOrEmail } from '@/utils/index';

dayjs.locale('vi');
dayjs.extend(LocalizedFormat);

interface TeacherGradeReviewItemProps
  extends Partial<TeacherGradeReviewDto>,
    HTMLAttributes<HTMLDivElement> {}

function TeacherGradeReviewItem({
  id,
  column_name,
  review_reason,
  request_student,
  expected_grade,
  current_grade,
  created_at,
  isFinished,
  comments = [],
}: TeacherGradeReviewItemProps) {
  const { id: classId } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const { data: myInfo, isSuccess: isMyInfoSuccess } = useGetMyInfo();
  const { mutate: addCommentMutate } = useAddCommentMutation();
  const {
    mutate: finishGradeReviewMutate,
    isPending: isFinishGradeReviewPending,
  } = useFinishGradeReviewMutation();
  const [newComment, setNewComment] = useState('');

  // Actions
  const handleAddNewComment = () => {
    addCommentMutate(
      {
        grade_review_id: id ?? '',
        comment: newComment,
      },
      {
        onSuccess() {
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

  const handleFinishGradeReview = () => {
    finishGradeReviewMutate(
      {
        grade_review_id: id ?? '',
      },
      {
        onSuccess() {
          message.success('Grade review finished');
          return queryClient.invalidateQueries({
            queryKey: classGradeReviewKey(classId),
          });
        },
        onError() {
          message.error('Failed to finish grade review');
        },
      }
    );
  };

  // Items render
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '3',
      label: 'Column Name',
      children: column_name,
    },
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
      key: '4',
      label: 'Review Reason',
      children: <p className="twp text-base">{review_reason}</p>,
      span: 3,
    },
  ];

  const collapseLabel = (
    <div className="flex flex-row justify-start items-center gap-x-4">
      <Avatar src={(request_student as User).avatar} icon={<UserOutlined />} />
      <span className="text-base font-semibold">
        {getUserFullNameOrEmail(request_student as User)}
      </span>
      <span className="text-gray-500 font-thin">
        {dayjs(created_at).format('llll')}
      </span>
    </div>
  );

  const collapseChildren = (
    <div>
      <div className="flex flex-col justify-between">
        <Descriptions
          title="Grade Review Info"
          layout="vertical"
          size="small"
          items={descriptionItems}
        />
        <Divider className="bg-sky-500 m-0 my-2" />
        {/* Comments Section */}
        <div className="w-full">
          {comments.length !== 0 && (
            <div className="mb-2 text-base font-medium">
              Has {comments.length}{' '}
              {comments.length > 1 ? 'comments' : 'comment'} about this review
            </div>
          )}
          {comments.map(
            ({ _id, sender, comment, created_at: commentCreatedAt }) => {
              const { avatar } = sender as User;
              return (
                <Card.Meta
                  key={_id}
                  className="w-full px-2 mb-2 flex flex-row gap-x-4"
                  avatar={<Avatar src={avatar} />}
                  title={
                    <Space>
                      <span className="text-base font-semibold">
                        {getUserFullNameOrEmail(sender as User)}
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
        {!isFinished && isMyInfoSuccess && (
          <div className="w-full px-2 flex flex-row justify-center items-center gap-x-2">
            <Avatar src={myInfo?.avatar} icon={<UserOutlined />} />
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

  const collapseItem: CollapseProps['items'] = [
    {
      key: id,
      label: collapseLabel,
      children: collapseChildren,
      headerClass: '!items-center',
      style: {
        borderRadius: token.borderRadiusLG,
        border: 'none',
      },
      extra: !isFinished && (
        <div className="flex flex-row justify-end items-center gap-x-4">
          <Tooltip title="Finish this review">
            <Button
              type="primary"
              shape="circle"
              loading={isFinishGradeReviewPending}
              icon={<CheckOutlined />}
              onClick={handleFinishGradeReview}
            ></Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  // --------------------------------------------------------

  return (
    <Badge.Ribbon
      className={`${!isFinished ? 'hidden' : ''}`}
      text={isFinished ? 'Reviewed' : 'On Reviewing'}
      color={isFinished ? 'green' : ''}
    >
      <Collapse
        className="shadow-md hover:drop-shadow-lg bg-gray-100"
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined className="" rotate={isActive ? 90 : 0} />
        )}
        items={collapseItem}
      />
    </Badge.Ribbon>
  );
}

export default memo(TeacherGradeReviewItem);
