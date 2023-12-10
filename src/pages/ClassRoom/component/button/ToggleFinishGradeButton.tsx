import { useQueryClient } from '@tanstack/react-query';
import { Button, Tooltip } from 'antd';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  useFinishedGrade,
  useUnFinishedGrade,
} from '@/app/store/server/features/class_grade/mutations';
import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { WebSocketContext } from '@/contexts/WebSocketContext.';

function ToggleFinishGradeButton() {
  const { id: class_id } = useParams();
  const { data: isFinished, isError } = useGetClassGrades(
    class_id,
    (data) => data.isFinished
  );

  const finishGrade = useFinishedGrade();
  const unfinishGrade = useUnFinishedGrade();

  const socket = useContext(WebSocketContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.emit('join', class_id);

    return () => {
      socket.emit('leave', class_id);
    };
  }, [class_id, socket]);

  const onToggleFinishGrade = async () => {
    if (isFinished) {
      await unfinishGrade.mutateAsync(class_id, {
        onSuccess() {
          return queryClient.invalidateQueries({
            queryKey: ['class-grades', class_id],
          });
        },
      });
      return;
    }
    await finishGrade.mutateAsync(class_id, {
      onSuccess() {
        return queryClient.invalidateQueries({
          queryKey: ['class-grades', class_id],
        });
      },
    });
  };

  if (isError) {
    return null;
  }

  return isFinished ? (
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
  );
}

export default ToggleFinishGradeButton;
