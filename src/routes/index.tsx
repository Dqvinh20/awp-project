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
import JoinClass from '@/pages/Student/JoinClass';
import ClassLayOut from '@/pages/ClassRoom/ClassLayOut';
import ClassRoom from '@/pages/ClassRoom/component/ClassRoom';
import MemberClass from '@/pages/ClassRoom/component/MemberClass';
import ClassGrade from '@/pages/ClassRoom/component/ClassGrade';
import NotFoundPage from '@/pages/404';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import EmailConfirmSuccess from '@/pages/Auth/EmailConfirmSuccess';
import OAuthSuccessRedirect from '@/pages/Auth/OAuthSuccessRedirect';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

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
        path: '/google-oauth-success-redirect/:accessToken/:from',
        element: <OAuthSuccessRedirect />,
      },
      {
        path: '/facebook-oauth-success-redirect/:accessToken/:from',
        element: <OAuthSuccessRedirect />,
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
            element: <EmailConfirmSuccess />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: '/reset-password',
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
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
