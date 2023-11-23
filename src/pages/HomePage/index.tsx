import { ClassRoom } from '@/app/store/server/features/classroom/interfaces';
import { useClassRoomByUserId } from '@/app/store/server/features/classroom/queries';
import ClassCard from '@/components/Card/ClassCard';
import useAuth from '@/hooks/useAuth';
import ClassRoomService from '@/services/ClassService';
import {
  EditOutlined,
  EllipsisOutlined,
  RiseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, FloatButton } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const avatarSrc = 'https://xsgames.co/randomusers/avatar.php?g=pixel'
const coverImageSrc = 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
function HomePage() {
  const { user_id } = useAuth();
  if (!user_id) {
    return <Navigate to="/" />;
  }
  // const { isLoading, data, isError, error} = useClassRoomByUserId(user_id)
  const { isLoading, data, isError, error,isRefetching} = useQuery<ClassRoom[]>({
    queryKey: ['classes'],
    queryFn: () => ClassRoomService.getAllClassRoomByUserId(user_id || ''),
    retry: false,
  });
  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <div>Error + {error.message}</div>;
  return (
    <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
      {data && data.map((myclass, index) => (
        <ClassCard
          classId={myclass.id}
          key={`class-component-${myclass.id}-${index}`}
          index={index}
          title={myclass.name}
          description={myclass.owner?.full_name ?? ''}
          avatarSrc={avatarSrc}
          coverImageSrc={coverImageSrc}
        />
      ))}
    </div>
  );
}

export default HomePage;
