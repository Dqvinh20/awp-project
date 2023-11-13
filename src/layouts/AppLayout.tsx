import { Navigate, Outlet } from 'react-router-dom';

function AppLayout() {
  // TODO: Replace this with your own authentication logic.
  const isAuthenticated = true;

  const renderBody = () => (
    <>
      <div>AppLayout</div>
      <Outlet />
    </>
  );

  return isAuthenticated ? renderBody() : <Navigate to="/sign-in" />;
}

export default AppLayout;
