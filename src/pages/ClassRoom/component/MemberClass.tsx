import { UserAddOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

import ClassMemberSkeleton from './skeletons/ClassMemberSkeleton';

import useClassDetail from '@/hooks/useClassDetail';
import MemberCard from '@/components/Card/MemberCard';
import { User } from '@/app/store/server/features/users/interfaces';
import ErrorPage from '@/pages/ErrorPage';

export default function MemberClass() {
  const { isLoading, data, isError, error, isSuccess } = useClassDetail();
  if (isError) return <ErrorPage error={error} />;

  const renderOwner = () => {
    if (isLoading) {
      return <ClassMemberSkeleton />;
    }
    return (
      data?.owner && (
        <MemberCard
          key={'member-card-owner'}
          email={data.owner.email}
          avatar={data.owner.avatar ?? ''}
          isOwner
        />
      )
    );
  };

  return (
    <div className="w-full bg-white h-full text-center flex flex-col justify-start pt-6">
      <div className="flex flex-col justify-center items-center w-full h-fit">
        <div className="flex flex-col w-3/5 gap-x-3 bg-white p-5 rounded-md">
          <div className="flex flex-row">
            <div className="title grow text-3xl text-left text-blue-600">
              Teacher
            </div>
            <a href="javascript:;">
              <UserAddOutlined className="text-3xl" />
            </a>
          </div>
          <Divider
            style={{ borderTop: '1px solid blue' }}
            key={'divider-teacher'}
            className="m-2 text-blue-600 bg-inherit"
          />
          {renderOwner()}
          {data?.teachers?.map((teacher: User) => (
            <div className="w-full" key={`teacher-${teacher.id}`}>
              <Divider
                style={{ borderTop: '1px solid black' }}
                className="m-2"
              />
              <MemberCard email={teacher.email} avatar={teacher.avatar ?? ''} />
            </div>
          ))}
        </div>
        <div className="flex flex-col w-3/5 mt-5 gap-x-5 bg-white p-5 rounded-md">
          <div className="flex flex-row gap-x-5">
            <div className="title grow text-3xl text-left text-blue-600">
              Student
            </div>
            <div className="text-blue-600">
              {data?.students ? data.students.length : 0} students
            </div>
            <a href="javascript:;">
              <UserAddOutlined className="text-3xl" />{' '}
            </a>
          </div>
          <Divider
            key={'divider-student'}
            style={{ borderTop: '1px solid blue' }}
            className="m-2 text-blue-600 bg-inherit"
          />
          {isLoading && (
            <>
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
            </>
          )}
          {data?.students &&
            data.students.map((student: User, index: number) => (
              <div className="w-full" key={`student-${student.id}`}>
                <MemberCard
                  email={student.email}
                  avatar={student.avatar ?? ''}
                />
                {index >= 1 && (
                  <Divider
                    style={{ borderTop: '1px solid black' }}
                    className="m-2"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
