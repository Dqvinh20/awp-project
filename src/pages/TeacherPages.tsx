import { Navigate, Outlet } from 'react-router-dom';

import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useUserRole } from '@/hooks/useUserRole';

function TeacherPages() {
  const userRole = useUserRole();

  if (USER_ROLE.Teacher !== userRole) {
    return <Navigate to="/page-not-found" replace />;
  }

  return <Outlet />;
}

export default TeacherPages;
