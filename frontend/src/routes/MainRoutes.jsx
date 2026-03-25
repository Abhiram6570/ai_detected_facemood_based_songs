import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute'; // Import the ProtectedRoute

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const FaceDetection = Loadable(lazy(() => import('pages/faceDetection/FaceDetection')));
const SongUpload = Loadable(lazy(() => import('pages/songupload/SongUpload')));
const RecommendationSongs = Loadable(lazy(() => import('pages/recommendationongs/RecommendationSongs')));
const Profile = Loadable(lazy(() => import('pages/setting/Profile')));
const PasswordChange = Loadable(lazy(() => import('pages/setting/PasswordChange')));
const ManuvalSelectSongs = Loadable(lazy(() => import('pages/ManuvalSelectSongs/ManuvalSelectSongs')));
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const FavoriteSongsTable = Loadable(lazy(() => import('pages/favoriteSongs/FavoriteSongsPage')));
const UserTable = Loadable(lazy(() => import('pages/tables/UserTable')));
const AllSongsTable = Loadable(lazy(() => import('pages/tables/AllSongsTable')));

// Main Routes configuration
const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/dashboard',
      children: [
        {
          path: '/dashboard',
          element: (
            <ProtectedRoute>
              <DashboardDefault />
            </ProtectedRoute>
          ),
        },
      ],
    },
    
    {
      path: '/faceDetection',
      element: (
        <ProtectedRoute>
          <FaceDetection />
        </ProtectedRoute>
      ),
    },
    {
      path: '/ManuvalSelectSongs',
      element: (
        <ProtectedRoute>
          <ManuvalSelectSongs />
         </ProtectedRoute>
      ),
    },
    {
      path: '/SongUpload',
      element: (
        <ProtectedRoute>
          <SongUpload />
        </ProtectedRoute>
      ),
    },
    {
      path: '/RecommendationSongs',
      element: (
        <ProtectedRoute>
          <RecommendationSongs />
        </ProtectedRoute>
      ),
    },
    {
      path: '/PasswordChange',
      element: (
        <ProtectedRoute>
          <PasswordChange />
        </ProtectedRoute>
      ),
    },
    {
      path: '/FavoriteSongs',
      element: (
        <ProtectedRoute>
          <FavoriteSongsTable />
        </ProtectedRoute>
      ),
    },
    {
      path: '/AllSongsTable',
      element: (
        <ProtectedRoute>
          <AllSongsTable />
        </ProtectedRoute>
      ),
    },
    {
      path: '/UserTable',
      element: (
        <ProtectedRoute>
          <UserTable />
        </ProtectedRoute>
      ),
    },
    {
      path: '/Profile',
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
  ],
};

export default MainRoutes;
