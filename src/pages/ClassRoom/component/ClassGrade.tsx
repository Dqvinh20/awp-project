/* eslint-disable max-lines-per-function */
import { Button, Space, Spin, Tooltip } from 'antd';

import { useParams } from 'react-router';

import { useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { useEffect, useContext } from 'react';

import GradeTable from './tables/GradeTable/GradeTable';

import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import {
  useFinishedGrade,
  useUnFinishedGrade,
} from '@/app/store/server/features/class_grade/mutations';
import { WebSocketContext } from '@/contexts/WebSocketContext.';

export default function ClassGrade() {
  const { id } = useParams();
  const {
    data: classGrades,
    isLoading: classGradesLoading,
    isSuccess,
    isError,
    error,
  } = useGetClassGrades(id);
  const userRole = useUserRole();
  const finishGrade = useFinishedGrade();
  const unfinishGrade = useUnFinishedGrade();
  const socket = useContext(WebSocketContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.emit('join', id);

    if (userRole === USER_ROLE.Student) {
      socket.on('grade.unfinished', async () => {
        await queryClient.invalidateQueries({
          queryKey: ['class-grades', id],
        });
      });

      socket.on('grade.finished', async () => {
        await queryClient.invalidateQueries({
          queryKey: ['class-grades', id],
        });
      });
    }
    return () => {
      if (userRole === USER_ROLE.Student) {
        socket.off('grade.unfinished');
        socket.off('grade.finished');
      }
    };
  }, [id, queryClient, socket, userRole]);

  const onToggleFinishGrade = async () => {
    if (classGrades?.isFinished) {
      await unfinishGrade.mutateAsync(id, {
        onSuccess() {
          return queryClient.invalidateQueries({
            queryKey: ['class-grades', id],
          });
        },
      });
      return;
    }
    await finishGrade.mutateAsync(id, {
      onSuccess() {
        return queryClient.invalidateQueries({
          queryKey: ['class-grades', id],
        });
      },
    });
  };

  const teacherActions = isSuccess && (
    <div className="mt-4 mb-10 flex justify-end">
      <Space>
        {classGrades.isFinished ? (
          <Tooltip title="Mark grade as finished for students not to view">
            <Button
              type="primary"
              onClick={onToggleFinishGrade}
              loading={unfinishGrade.isPending}
            >
              UnFinished
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Mark grade as finished for students to view">
            <Button
              type="primary"
              onClick={onToggleFinishGrade}
              loading={finishGrade.isPending}
            >
              Finished
            </Button>
          </Tooltip>
        )}
      </Space>
    </div>
  );

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
          {userRole === USER_ROLE.Teacher && teacherActions}
        </>
      )}
      {isError && renderError()}
    </div>
  );
}
