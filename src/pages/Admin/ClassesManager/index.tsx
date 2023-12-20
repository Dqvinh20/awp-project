import ClassTable from './tables/ClassTable';

import CreateClassFAB from './FAB/CreateClassFAB';

import DocumentTitle from '@/components/DocumentTitle';

import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

function ClassesManager() {
  const { data, isLoading } = useClassesQuery({
    sort: '-created_at',
    pagination: false,
  });
  return (
    <>
      <DocumentTitle title="Classes Manager" />
      <div className="bg-white h-full w-full p-6">
        <ClassTable classes={data?.docs} loading={isLoading} />
        <CreateClassFAB />
      </div>
    </>
  );
}

export default ClassesManager;
