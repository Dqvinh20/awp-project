import { useQueryClient } from '@tanstack/react-query';
import { FloatButton } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  CheckOutlined,
  LoadingOutlined,
  StopOutlined,
} from '@ant-design/icons';

import {
  useFinishedGrade,
  useUnFinishedGrade,
} from '@/app/store/server/features/class_grade/mutations';
import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { WebSocketContext } from '@/contexts/WebSocketContext.';

function ToggleFinishGradeFAB() {
  const { id: class_id } = useParams();
  const { data: isFinishedServer, isError } = useGetClassGrades(
    class_id,
    (data) => data.isFinished
  );
  const [isFinished, setIsFinished] = useState<boolean>(isFinishedServer);

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
        onSuccess(data) {
          setIsFinished(data.isFinished);
          return queryClient.invalidateQueries({
            queryKey: ['class-grades', class_id],
          });
        },
      });
      return;
    }
    await finishGrade.mutateAsync(class_id, {
      onSuccess(data) {
        setIsFinished(data.isFinished);
        return queryClient.invalidateQueries({
          queryKey: ['class-grades', class_id],
        });
      },
    });
  };

  if (isError) {
    return null;
  }

  const tooltip = (
    <div>
      {isFinished
        ? 'Prevent students from viewing grade'
        : 'Finish grading and allow students to view grade'}
    </div>
  );
  const icon = isFinished ? <StopOutlined /> : <CheckOutlined />;
  const isLoading = finishGrade.isPending || unfinishGrade.isPending;
  const onButtonClick = isLoading ? undefined : onToggleFinishGrade;

  return (
    <FloatButton
      shape="circle"
      type="primary"
      tooltip={tooltip}
      onClick={onButtonClick}
      icon={isLoading ? <LoadingOutlined /> : icon}
    />
  );
}

export default ToggleFinishGradeFAB;
