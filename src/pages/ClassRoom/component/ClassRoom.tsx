import { useParams } from 'react-router-dom';

import BannerClass from './BannerClass';

import { useClassDetailQuery } from '@/app/store/server/features/classroom/queries';

export default function ClassRoom() {
  const { id } = useParams();

  const { isLoading, data, isError, error, isSuccess } = useClassDetailQuery(
    id as string
  );

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <div>Error + {error.message}</div>;
  return (
    isSuccess && (
      <div className="h-full text-center flex flex-col justify-start">
        <div className="flex justify-center items-center w-full h-fit mt-2">
          <BannerClass title={data.name} />
        </div>
        <div className="">{data.description}</div>
        <div className="">{data.code}</div>
      </div>
    )
  );
}
