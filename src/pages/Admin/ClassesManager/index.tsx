import ClassTable from './tables/ClassTable';

import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

function ClassesManager() {
  const { data } = useClassesQuery({
    sort: 'created_at',
    pagination: false,
  });
  return (
    <div className="bg-white h-full w-full p-6">
      <ClassTable classes={data?.docs} />
    </div>
  );
}

export default ClassesManager;
