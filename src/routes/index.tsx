import { createBrowserRouter } from 'react-router-dom';

import App from '@/app';
import ErrorPage from '@/pages/ErrorPage';
import AppLayout from '@/layouts/AppLayout/index';
import Home from '@/pages/HomePage/index';
import AuthLayout from '@/layouts/AuthLayout';
import SignInPage from '@/pages/Auth/SignInPage';
import LandingPage from '@/pages/LandingPage/index';
import UserRouter from '@/pages/User/UserRouter';
import ProtectedPage from '@/pages/ProtectedPage';

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        element: <ProtectedPage />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/home',
                element: <Home />,
              },
            ],
          },
          {
            path: '/users/edit/:id',
            element: <UserRouter />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/sign-in',
            element: <SignInPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
