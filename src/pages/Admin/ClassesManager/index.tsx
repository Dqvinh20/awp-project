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
      <div className="bg-white h-full w-full px-6 py-4">
        <CreateClassFAB />
        <ClassTable
          title={() => (
            <span className="text-base font-semibold">Class Table</span>
          )}
          classes={data?.docs}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default ClassesManager;
