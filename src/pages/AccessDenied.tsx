import { useNavigate } from 'react-router-dom';

import UnauthImg from '@/assets/error_401.jpg';
import { useUserRole } from '@/hooks/useUserRole';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

function AccessDenied() {
  const navigate = useNavigate();
  const userRole = useUserRole();
  const isAdmin = userRole === USER_ROLE.Admin;
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <img
        src={UnauthImg}
        className="object-contain h-96 bg-red-500"
        alt="AccessDeniedImg"
      />
      <button
        type="button"
        className="twp text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        onClick={() => navigate(isAdmin ? '/admin/accounts' : '/home')}
      >
        Go Back {isAdmin ? 'to Admin Page' : 'to Home Page'}
      </button>
    </div>
  );
}

export default AccessDenied;
