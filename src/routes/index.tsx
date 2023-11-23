import { createBrowserRouter } from 'react-router-dom';

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
import ClassRouter from '@/pages/ClassRoom/ClassRouter';
import ClassLayOut from '@/pages/ClassRoom/ClassLayOut';
import ClassRoom from '@/pages/ClassRoom/component/ClassRoom';
import AboutClass from '@/pages/ClassRoom/component/AboutClass';
import MemberClass from '@/pages/ClassRoom/component/MemberClass';
import ClassGrade from '@/pages/ClassRoom/component/ClassGrade';

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
                element: <Home />
              },
              {
                path: '/class/*',
                children: [
                  {
                      path: ':id',
                      element: <ClassLayOut />,
                      children: [
                        {
                          path: 'news',
                          element: <ClassRoom />
                        },
                        {
                          path: 'members',
                          element: <MemberClass />
                        },
                        {
                          path: 'grade',
                          element: <ClassGrade />
                        }
                      ]
                    
                  }
                ]
              },
              {
                path: '/joinclass/:id',
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
        ],
      },
    ],
  },
]);

export default router;
