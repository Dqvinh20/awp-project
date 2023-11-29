import { useState } from 'react';

import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import CreateClassModal from '@/components/Modal/CreateClassModal';
import JoinClassModal from '@/components/Modal/JoinClassModal';

function NoContent() {
  const { isLoading, data } = useGetMyInfo();
  const [open, setOpen] = useState(false);

  if (isLoading) return null;

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div
        className="h-1/5 flex-shrink w-11/12"
        style={{
          backgroundImage:
            'url("https://www.gstatic.com/classroom/empty_states_home.svg")',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <h2 className="">
        <p className="text-center text-[0.875rem] leading-[1.25rem] tracking-[.01785714em] font-medium text-[#3c4043]">
          Add your first class to get started
        </p>
        <button
          className="twp w-full bg-[rgb(26,115,232)] text-white px-4 py-2 rounded text-base hover:bg-[rgb(95,155,233)]"
          onClick={handleOpenModal}
        >
          {data?.role === USER_ROLE.Teacher ? 'Create a class' : 'Join a class'}
        </button>
        {data?.role === USER_ROLE.Teacher ? (
          <CreateClassModal open={open} setOpen={setOpen} />
        ) : (
          <JoinClassModal open={open} setOpen={setOpen} />
        )}
      </h2>
    </div>
  );
}

export default NoContent;
