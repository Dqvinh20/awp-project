/* eslint-disable max-lines-per-function */
import { useEffect } from 'react';
import { App, Avatar, Button, Card, Spin } from 'antd';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useJoinClass } from '@/app/store/server/features/classroom/mutations';

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
          notification.error({
            message: 'Error Occurred',
            description: error?.response?.data.message ?? error.message,
          });
          return;
        }
        notification.error({
          message: 'Error Occured',
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
  // if (!c)
  //   return (
  //     <div className="flex justify-center align-middle h-full w-full p-8 text-lg font-medium text-red-500">
  //       No class code
  //     </div>
  //   );

  return (
    <div className="flex justify-center align-middle h-full w-full p-8">
      <div className="rounded w-2/5 h-fit border-solid border-2 border-gray-300 overflow-hidden">
        <div className="bg-slate-100 p-8 flex flex-col justify-center align-middle">
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
            <p className="w-1/2">
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
        <div className="p-8">
          <div className="flex flex-column justify-center align-middle text-center">
            <Card
              // extra={<CaretLeftOutlined />}
              size="small"
              hoverable
              className="text-xs flex flex-column justify-center border-slate-500"
            >
              <Meta
                className="text-xs "
                // style={{marginRight: "2rem"}}
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
              {/* <DownOutlined style={{position: "absolute",top:"25px", right: "10px"}}/> */}
            </Card>
          </div>

          <div className="flex justify-center align-middle text-center"></div>
          <div className="flex justify-center align-middle text-center">
            <p className="text-xs">You are joining the class as a student.</p>
          </div>
          <div className="flex justify-center align-middle text-center text-xs">
            <Button
              className=""
              size="middle"
              type="primary"
              href="javascript::void(0)"
              onClick={() => handleJoin({ c })}
            >
              Join class
            </Button>
          </div>
          <div className="flex justify-center align-middle text-center">
            <p className="text-xs w-3/5">
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
    </div>
  );
}

export default JoinClass;
