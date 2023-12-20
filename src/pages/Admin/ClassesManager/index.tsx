import ClassTable from './tables/ClassTable';

import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

function ClassesManager() {
  const { data, isLoading } = useClassesQuery({
    sort: 'created_at',
    pagination: false,
  });
  return (
    <div className="bg-white h-full w-full p-6">
      <ClassTable classes={data?.docs} loading={isLoading} />
    </div>
  );
}

export default ClassesManager;
