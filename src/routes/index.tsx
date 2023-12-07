import { Navigate, createBrowserRouter } from 'react-router-dom';

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
import ClassLayOut from '@/pages/ClassRoom/ClassLayOut';
import ClassRoom from '@/pages/ClassRoom/component/ClassRoom';
import MemberClass from '@/pages/ClassRoom/component/MemberClass';
import ClassGrade from '@/pages/ClassRoom/component/ClassGrade';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import EditUserLayout from '@/layouts/EditLayout/index';
import GradeStructure from '@/pages/ClassRoom/component/GradeStructure';

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
                      {
                        path: 'grade-structure',
                        element: <GradeStructure />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/classes/join',
                element: <SuspenseWrapper path="pages/Student/JoinClass" />,
              },
            ],
          },
          {
            element: <EditUserLayout />,
            children: [
              {
                path: '/users/edit/:id',
                element: <EditUser />,
              },
            ]
          },
        ],
      },
      {
        path: '/google-oauth-success-redirect/:accessToken/:from',
        element: <SuspenseWrapper path="pages/Auth/OAuthSuccessRedirect" />,
      },
      {
        path: '/facebook-oauth-success-redirect/:accessToken/:from',
        element: <SuspenseWrapper path="pages/Auth/OAuthSuccessRedirect" />,
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
            path: '/email-confirmation',
            element: <SuspenseWrapper path="pages/Auth/EmailConfirmSuccess" />,
          },
          {
            path: '/forgot-password',
            element: <SuspenseWrapper path="pages/Auth/ForgotPassword" />,
          },
          {
            path: '/reset-password',
            element: <SuspenseWrapper path="pages/Auth/ResetPassword" />,
          },
        ],
      },
      {
        path: '/privacy-policy',
        element: <SuspenseWrapper path="pages/PrivacyPolicy" />,
      },
      {
        path: '/page-not-found',
        element: <SuspenseWrapper path="pages/404" />,
      },
      {
        path: '*',
        element: <Navigate to="/page-not-found" />,
      },
    ],
  },
]);

export default router;
