import { Divider } from 'antd';

import { Fragment } from 'react';

import ClassMemberSkeleton from './skeletons/ClassMemberSkeleton';

import InviteMember from './modal/InviteMember';

import useClassDetail from '@/hooks/useClassDetail';
import MemberCard from '@/components/Card/MemberCard';
import { USER_ROLE, User } from '@/app/store/server/features/users/interfaces';
import ErrorPage from '@/pages/ErrorPage';

import { useUserRole } from '@/hooks/useUserRole';

const CustomDivider = () => <Divider className="m-0  border-gray-300" />;

export default function MemberClass() {
  const userRole = useUserRole();
  const { isLoading, data, isError, error } = useClassDetail();
  if (isError) return <ErrorPage error={error} />;

  return (
    <div className="w-full h-full bg-white flex flex-col justify-start items-center p-6">
      <div className="w-4/5 grid grid-rows-2 gap-y-6">
        {/* Teacher Section */}
        <div>
          <div className="twp pl-4 py-2 flex flex-row text-[rgb(25,103,210)] border-b border-b-[rgb(25,103,210)]">
            <div className="grow text-3xl align-middle">Teachers</div>
            {userRole === USER_ROLE.Teacher && <InviteMember isInviteTeacher />}
          </div>
          {isLoading && (
            <>
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
            </>
          )}
          {/* Render owner */}
          {data?.owner && (
            <MemberCard
              key={'member-card-owner'}
              id={data.owner.id}
              email={data.owner.email}
              avatar={data.owner.avatar ?? ''}
              isOwner
            />
          )}
          {/* Render teachers */}
          {data?.teachers?.map((teacher: User) => (
            <Fragment key={`member-card-teacher-${teacher.id}`}>
              <CustomDivider />
              <MemberCard
                id={teacher.id}
                email={teacher.email}
                avatar={teacher.avatar ?? ''}
                isTeacher
              />
            </Fragment>
          ))}
        </div>
        {/* Teachers Section */}

        {/* Students Section */}
        <div>
          <div className="twp pl-4 py-2 flex flex-row text-[rgb(25,103,210)] border-b border-b-[rgb(25,103,210)]">
            <div className="grow text-3xl align-middle">Students</div>
            <span className="flex items-center mr-4">
              {`${data?.students ? data.students.length : 0} students`}
            </span>
            {userRole === USER_ROLE.Teacher && <InviteMember />}
          </div>

          {isLoading && (
            <>
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
              <ClassMemberSkeleton />
            </>
          )}
          {/* Render students */}
          {data?.students &&
            data.students.map((student: User, index: number) => (
              <Fragment key={`member-card-student-${student.id}`}>
                <MemberCard
                  id={student.id}
                  email={student.email}
                  avatar={student.avatar ?? ''}
                  isStudent
                />
                {index >= 1 && index <= data.students.length && (
                  <CustomDivider />
                )}
              </Fragment>
            ))}
        </div>
        {/* Students Section */}
      </div>
    </div>
  );
}
