import ClassCardSkeleton from '../ClassRoom/component/skeletons/ClassCardSkeleton';
import ErrorPage from '../ErrorPage';

import NoContent from './NoContent';

import ClassCard from '@/components/Card/ClassCard';
import { useClassesQuery } from '@/app/store/server/features/classroom/queries';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

// const avatarSrc = 'https://xsgames.co/randomusers/avatar.php?g=pixel';
// const coverImageSrc =
//   'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png';

function HomePage() {
  const { isLoading, data, isError, error, isSuccess } = useClassesQuery();
  const { data: user } = useGetMyInfo();

  if (isError) return <ErrorPage error={error} />;

  if (isSuccess && data?.docs?.length === 0) return <NoContent />;

  return (
    <div className="w-full p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading && (
        <>
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
          <ClassCardSkeleton />
        </>
      )}
      {isSuccess &&
        data.docs &&
        data?.docs?.map((classDetail, index) => (
          <ClassCard
            key={`class-card-${classDetail.id}-${index}`}
            {...classDetail}
            classId={classDetail.id}
            isTeacher={user?.role === USER_ROLE.Teacher}
            isOwner={classDetail.owner.id === user?.id}
          />
        ))}
    </div>
  );
}

export default HomePage;
