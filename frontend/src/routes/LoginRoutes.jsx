import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));
const FaceDetection = Loadable(lazy(() => import('pages/faceDetection/FaceDetection')));

import ProtectedRoute from 'components/ProtectedRoute'; // Import the ProtectedRoute


// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/faceDetection',
      element: <ProtectedRoute><FaceDetection /></ProtectedRoute>
    }
  ]
};

export default LoginRoutes;
