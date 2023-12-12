/* eslint-disable max-lines-per-function */
import { useEffect } from 'react';
import { App, Avatar, Button, Card, Spin } from 'antd';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useJoinClass } from '@/app/store/server/features/classroom/mutations';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

const { Meta } = Card;

function JoinClass() {
  const { notification, message } = App.useApp();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const t = searchParams.get('t');
  const c = searchParams.get('c');

  const navigate = useNavigate();

  const joinClassMutation = useJoinClass();

  const handleJoin = (params: { t: string } | { c: string } | any) => {
    joinClassMutation.mutate(params, {
      async onSuccess(data) {
        await queryClient.invalidateQueries({ queryKey: ['classes'] });
        await message.success('Join Class Success');
        navigate(`/class/${data.id}/news`);
      },
      onError(error) {
        if (error instanceof AxiosError) {
          if (error?.response?.data.message === 'User already in class') {
            navigate(`/class/${error?.response?.data.class_id}/news`);
            return;
          }
          notification.error({
            message: 'Error Occurred',
            description: error?.response?.data.message ?? error.message,
          });
          return;
        }
        notification.error({
          message: 'Error Occurred',
          description: error.message,
        });
      },
    });
  };

  useEffect(() => {
    const joinClassByToken = async () => {
      try {
        const data = await joinClassMutation.mutateAsync({ t });
        await queryClient.invalidateQueries({ queryKey: ['classes'] });
        navigate(`/class/${data.id}/news`);
      } catch (error: any) {
        if (error instanceof AxiosError) {
          await notification.error({
            message: 'Error Occurred',
            description: error?.response?.data.message ?? error.message,
          });
          navigate('/home');
          return;
        }
        notification.error({
          message: 'Error Occured',
          description: error.message,
        });
      }
    };

    if (t) {
      joinClassByToken();
    }
  }, []);

  const { isLoading: profileLoading, data, isError, error } = useGetMyInfo();

  if (!c && !t) return <Navigate to="/page-not-found" />;

  if (t) {
    return <Spin fullscreen />;
  }

  if (profileLoading) return <Spin fullscreen />;
  if (isError) return <div>Error + {error.message}</div>;

  return (
    <div className="flex justify-center align-middle h-full w-full p-6">
      <div className="rounded w-full md:w-4/5 h-fit border-solid border-2 border-gray-300 overflow-hidden">
        <div className="bg-slate-100 p-4 flex flex-col justify-center align-middle">
          <div className="flex justify-center align-middle">
            <img
              src="https://www.gstatic.com/classroom/logo_square_rounded.svg"
              className="w-24 mb-4"
              alt="Google Classroom"
              data-iml="28027"
            />
          </div>
          <div className="flex justify-center align-middle text-center gap-x-1.5">
            <strong className="text-2xl">AWP </strong>
            <span className="text-end text-2xl">Classroom</span>
          </div>
          <div className="text-center text-sm flex justify-center align-middle w-full">
            <p className="w-full text-sm">
              Classroom helps classes communicate, save time, and stay
              organized.
              <a
                className=""
                target="_blank"
                href="https://support.google.com/edu/classroom/answer/6020279?hl=en&amp;authuser=0"
                rel="noreferrer"
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
        <div className="py-6 px-4 flex flex-col justify-center items-center">
          <Card
            size="small"
            hoverable
            className="text-xs border-slate-500 !w-full max-w-xs py-2"
          >
            <Meta
              className="text-xs"
              avatar={
                <Avatar
                  className=""
                  src={
                    data?.avatar ??
                    'https://xsgames.co/randomusers/avatar.php?g=pixel'
                  }
                />
              }
              title={data?.full_name}
              description={data?.email}
            />
          </Card>
          <p className="text-xs sm:text-base">
            You are joining the class as a{' '}
            {(data?.role as unknown as USER_ROLE).toLowerCase()}.
          </p>
          <Button
            className="w-full h-[48px] text-base xs:w-3/5 sm:h-fit md:w-[40%] lg:w-[20%]"
            size="middle"
            type="primary"
            onClick={() => handleJoin({ c })}
          >
            JOIN CLASS
          </Button>
          <p className="text-center text-xs w-full">
            By joining, you agree to share contact information with people in
            your class.{' '}
            <a
              className=""
              target="_blank"
              href="https://support.google.com/edu/classroom/answer/6386395?hl=en&amp;authuser=0"
              rel="noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default JoinClass;
