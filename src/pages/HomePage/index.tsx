import ClassCardSkeleton from '../ClassRoom/component/skeletons/ClassCardSkeleton';
import ErrorPage from '../ErrorPage';

import ClassCard from '@/components/Card/ClassCard';
import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

const avatarSrc = 'https://xsgames.co/randomusers/avatar.php?g=pixel';
const coverImageSrc =
  'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png';

function HomePage() {
  const { isLoading, data, isError, error, isSuccess } = useClassesQuery();

  if (isError) return <ErrorPage error={error} />;

  return (
    <div className="w-full flex flex-wrap gap-x-6 gap-y-6 p-6">
      {isLoading && (
        <>
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
            key={`class-component-${classDetail.id}-${index}`}
            classId={classDetail.id}
            index={index}
            title={classDetail.name}
            description={classDetail.owner?.full_name ?? ''}
            avatarSrc={avatarSrc}
            coverImageSrc={coverImageSrc}
          />
        ))}
    </div>
  );
}

export default HomePage;
