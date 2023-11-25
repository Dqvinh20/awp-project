import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card } from 'antd';
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import ClassRoomService from '@/services/ClassService';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassRoom } from '@/app/store/server/features/classroom/interfaces';

const { Meta } = Card;

const user = {
  email: 'thong89xx@gmail.com',
  name: 'Thong Vo',
};
export default function JoinClass() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient()

  const t = searchParams.get('t');
  const c = searchParams.get('c');
  const navigate = useNavigate();
  const joinClassRoomMutation = useMutation<ClassRoom>({
    mutationFn: (params: any) => ClassRoomService.joinClass(params),
    
    onSuccess: (data:any) =>{
      const urlClass = `/class/${data.id}/news`;
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      navigate(urlClass);
    },
    onError:(error)=>{
      console.log("Error :",error)
      // navigate('/');
    }
  });
  const HandleJoin = async (params: { t: string } | { c: string } | any) => {
    joinClassRoomMutation.mutate(params)
    // try {
    //   const data = await ClassRoomService.joinClass(params);
    //   const urlClass = `/class/${data.id}/news`;
    //   navigate(urlClass);
    // } catch {
    //   // navigate('/');
    // }
  };
  useEffect(()=>{
    HandleJoin({ t });

  },[])
  if (t) {
    return <></>;
  }
  const { isLoading, data, isError, error } = useGetMyInfo();
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <div>Error + {error.message}</div>;
  if (!c) return <>Not Found Invite Code</>;
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
                      data?.avatar ||
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
              onClick={() => HandleJoin({ c })}
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
