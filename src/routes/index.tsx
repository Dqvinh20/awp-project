import { Navigate, createBrowserRouter } from 'react-router-dom';

import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

import SuspenseWrapper from '@/components/SuspenseWrapper';

import App from '@/app';
import ErrorPage from '@/pages/ErrorPage';
import LandingPage from '@/pages/LandingPage/index';
import AuthLayout from '@/layouts/AuthLayout';
import SignInPage from '@/pages/Auth/SignInPage';
import SignUpPage from '@/pages/Auth/SignUpPage';
import ProtectedPage from '@/pages/ProtectedPage';

// Users Pages
import AppLayout from '@/layouts/AppLayout/index';
import Home from '@/pages/HomePage/index';
import TeacherPages from '@/pages/TeacherPages';
import ClassLayOut from '@/pages/ClassRoom/ClassLayOut';
import ClassRoom from '@/pages/ClassRoom/component/ClassRoom';
import MemberClass from '@/pages/ClassRoom/component/MemberClass';
import ClassGrade from '@/pages/ClassRoom/component/ClassGrade';
import GradeStructure from '@/pages/ClassRoom/component/GradeStructure';
import GradeReview from '@/pages/ClassRoom/component/GradeReview';

// Admin Pages
import AdminLayout from '@/layouts/AdminLayout/index';
import AccountsManager from '@/pages/Admin/AccountsManager/index';
import ClassesManager from '@/pages/Admin/ClassesManager/index';

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
        element: (
          <ProtectedPage roles={[USER_ROLE.Student, USER_ROLE.Teacher]} />
        ),
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/home',
                element: <Home />,
              },
              {
                element: <TeacherPages />,
                children: [
                  {
                    path: '/pending-reviews',
                    element: (
                      <SuspenseWrapper path="pages/PendingReviews/index" />
                    ),
                  },
                ],
              },
              {
                path: '/class/:id/*',
                children: [
                  {
                    path: '*',
                    element: <Navigate to="/page-not-found" replace />,
                  },
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
                      {
                        path: 'grade-review',
                        element: <GradeReview />,
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
        ],
      },
      {
        element: <ProtectedPage roles={[USER_ROLE.Admin]} />,
        children: [
          {
            path: '/admin/*',
            element: <AdminLayout />,
            children: [
              {
                path: 'accounts',
                element: <AccountsManager />,
              },
              {
                path: 'classes',
                element: <ClassesManager />,
              },
              {
                path: '*',
                element: <Navigate to="/page-not-found" replace />,
              },
            ],
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
        element: <Navigate to="/page-not-found" replace />,
      },
    ],
  },
]);

export default router;
