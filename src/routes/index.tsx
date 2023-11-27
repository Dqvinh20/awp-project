import { Navigate, createBrowserRouter } from 'react-router-dom';

import { QueryClient } from '@tanstack/react-query';

import App from '@/app';
import ErrorPage from '@/pages/ErrorPage';
import AppLayout from '@/layouts/AppLayout/index';
import Home from '@/pages/HomePage/index';
import AuthLayout from '@/layouts/AuthLayout';
import SignInPage from '@/pages/Auth/SignInPage';
import LandingPage from '@/pages/LandingPage/index';
import ProtectedPage from '@/pages/ProtectedPage';
import SignUpPage from '@/pages/Auth/SignUpPage';
import EditUser from '@/pages/User/EditUser';
import JoinClass from '@/pages/Student/JoinClass';
import ClassLayOut from '@/pages/ClassRoom/ClassLayOut';
import ClassRoom from '@/pages/ClassRoom/component/ClassRoom';
import MemberClass from '@/pages/ClassRoom/component/MemberClass';
import ClassGrade from '@/pages/ClassRoom/component/ClassGrade';
import NotFoundPage from '@/pages/404';
import GoogleOAuthSuccessRedirect from '@/pages/Auth/GoogleOAuthSuccessRedirect';
import FacebookOAuthSuccessRedirect from '@/pages/Auth/FacebookOAuthSuccessRedirect';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
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
              {
                path: '/class/:id/*',
                children: [
                  { path: '*', element: <Navigate to="/page-not-found" /> },
                  {
                    element: <ClassLayOut />,
                    children: [
                      {
                        index: true,
                        path: 'news',
                        element: <ClassRoom />,
                      },
                      {
                        path: 'members',
                        element: <MemberClass />,
                      },
                      {
                        path: 'grade',
                        element: <ClassGrade />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/classes/join',
                element: <JoinClass />,
              },
            ],
          },
          {
            path: '/users/edit/:id',
            element: <EditUser />,
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
          {
            path: '/sign-up',
            element: <SignUpPage />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: '/reset-password',
            element: <ResetPassword />,
          },
          {
            path: '/google-oauth-success-redirect/:accessToken/:from',
            element: <GoogleOAuthSuccessRedirect />,
          },
          {
            path: '/facebook-oauth-success-redirect/:accessToken/:from',
            element: <FacebookOAuthSuccessRedirect />,
          },
        ],
      },
      {
        path: '/page-not-found',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate to="/page-not-found" />,
      },
    ],
  },
]);

export default router;
