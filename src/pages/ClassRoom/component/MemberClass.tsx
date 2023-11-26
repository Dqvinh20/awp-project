import { UserAddOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

import useClassDetail from '@/hooks/useClassDetail';
import MemberCard from '@/components/Card/MemberCard';
import { User } from '@/app/store/server/features/users/interfaces';

export default function MemberClass() {
  const { isLoading, data, isError, error } = useClassDetail();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <div>Error + {error.message}</div>;

  return (
    <div className="h-full text-center flex flex-col justify-start bg-slate-50">
      <div className="flex flex-col justify-center items-center w-full h-fit mt-2">
        <div className="flex flex-col w-3/5 mt-5 gap-x-3 bg-white p-5 rounded-md">
          <div className="flex flex-row">
            <div className="title grow text-3xl text-left text-blue-600">
              Teacher
            </div>
            <a href="javascript:void(0)">
              <UserAddOutlined className="text-3xl" />{' '}
            </a>
          </div>
          <Divider
            style={{ borderTop: '1px solid blue' }}
            className="m-2 text-blue-600 bg-inherit"
          />
          {data?.owner && (
            <>
              <MemberCard
                key={'member-card-owner'}
                email={data.owner.email}
                avatar={data.owner.avatar || ''}
              />
            </>
          )}
          {data?.teachers?.map((teacher: User, index: number) => (
            <>
              <Divider
                style={{ borderTop: '1px solid black' }}
                className="m-2"
              />
              <MemberCard
                key={`member-card-teacher-${index}`}
                email={teacher.email}
                avatar={teacher.avatar ?? ''}
              />
            </>
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
            <a href="javascript:void(0)">
              <UserAddOutlined className="text-3xl" />{' '}
            </a>
          </div>
          <Divider
            style={{ borderTop: '1px solid blue' }}
            className="m-2 text-blue-600 bg-inherit"
          />
          {data?.students &&
            data.students.map((student: User, index: number) => (
              <>
                <MemberCard
                  key={'member-card-student-' + index}
                  email={student.email}
                  avatar={student.avatar ?? ''}
                />
                {index >= 1 && (
                  <Divider
                    style={{ borderTop: '1px solid black' }}
                    className="m-2"
                  />
                )}
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
