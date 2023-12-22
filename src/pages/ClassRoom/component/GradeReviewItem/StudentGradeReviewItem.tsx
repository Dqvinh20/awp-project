import { HTMLAttributes, memo, useRef, useState } from 'react';

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
  Space,
  theme,
} from 'antd';

import { CaretRightOutlined, SendOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';

import parse from 'html-react-parser';

import { StudentGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import 'dayjs/locale/vi';
import { User } from '@/app/store/server/features/users/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useAddCommentMutation } from '@/app/store/server/features/grade_review/mutations';
import { classGradeReviewKey } from '@/app/store/server/features/grade_review/queries';
import { getUserFullNameOrEmail } from '@/utils/index';
import QuillEditor, {
  QuillEditorRefType,
} from '@/components/Editor/QuillEditor';

dayjs.locale('vi');
dayjs.extend(LocalizedFormat);

interface StudentGradeReviewItemProps
  extends Partial<StudentGradeReviewDto>,
    HTMLAttributes<HTMLDivElement> {
  defaultOpenReviewKey?: string | null;
}

// eslint-disable-next-line max-lines-per-function
function StudentGradeReviewItem({
  id,
  column_name,
  review_reason,
  expected_grade,
  current_grade,
  updated_grade,
  created_at,
  isFinished,
  comments = [],
  defaultOpenReviewKey = '',
}: StudentGradeReviewItemProps) {
  const { id: classId } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { token } = theme.useToken();
  const { data: myInfo, isSuccess: isMyInfoSuccess } = useGetMyInfo();
  const { mutate: addCommentMutate } = useAddCommentMutation();
  const [newComment, setNewComment] = useState('');
  const commentInputRef = useRef<QuillEditorRefType>(null);

  // Actions
  const handleAddNewComment = () => {
    addCommentMutate(
      {
        grade_review_id: id ?? '',
        comment: newComment,
      },
      {
        onSuccess() {
          if (commentInputRef.current) {
            commentInputRef.current
              .getEditor()
              .deleteText(0, newComment.length);
            commentInputRef.current.blur();
          }
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

  // Items render
  const descriptionItems: DescriptionsProps['items'] = [
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
      label: isFinished && 'Updated Grade',
      children: isFinished && (
        <span className="text-base">{updated_grade}</span>
      ),
    },
    {
      key: '4',
      label: 'Review Reason',
      children: <p className="twp text-base">{review_reason}</p>,
      span: 3,
    },
  ];

  const label = (
    <div>
      <span className="text-base font-bold">Review Column: {column_name}</span>{' '}
      •{' '}
      <span className="text-gray-500 font-thin">
        {dayjs(created_at).format('llll')}
      </span>
    </div>
  );

  const children = (
    <div>
      <div className="flex flex-col justify-between">
        <Descriptions
          title="Grade Review Info"
          layout="vertical"
          size="small"
          items={descriptionItems}
        />
        {comments && comments.length !== 0 && (
          <>
            <Divider className="bg-sky-500 m-0 my-2" />
            {/* Comments Section */}
            <div className="w-full">
              {comments.length !== 0 && (
                <div className="mb-2 text-base font-medium">
                  Has {comments.length}{' '}
                  {comments.length > 1 ? 'comments' : 'comment'} about this
                  review
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
                      description={parse(comment)}
                    />
                  );
                }
              )}
            </div>
          </>
        )}
        {/* New Comment Section */}
        {!isFinished && isMyInfoSuccess && (
          <div className="w-full px-2 flex flex-row justify-center items-center gap-x-4">
            <Avatar src={myInfo?.avatar} />
            <QuillEditor
              ref={commentInputRef}
              onChange={(value) => {
                setNewComment(value);
              }}
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
      label,
      children,
      style: {
        borderRadius: token.borderRadiusLG,
        border: 'none',
      },
    },
  ];
  // --------------------------------------------------------

  return (
    <Badge.Ribbon
      text={isFinished ? 'Reviewed' : 'On Reviewing'}
      color={isFinished ? 'green' : ''}
    >
      <Collapse
        className="shadow-md hover:drop-shadow-lg bg-gray-100"
        bordered={false}
        defaultActiveKey={[defaultOpenReviewKey ?? '']}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        items={collapseItem}
      />
    </Badge.Ribbon>
  );
}

export default memo(StudentGradeReviewItem);
