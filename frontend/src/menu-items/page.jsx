// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Mood Based Songs',
  type: 'group',
  children: [
    {
         id: 'dashboard',
         title: 'Dashboard',
         type: 'item',
         url: '/dashboard',
         icon: icons.DashboardOutlined,
         breadcrumbs: false
       },
       {
           id: 'ManuvalSelectSongs',
           title: 'Manual Select Songs',
           type: 'item',
           url: '/ManuvalSelectSongs',
           icon: icons.FileSearchOutlined, // Updated icon
         },
       {
         id: 'Profile',
         title: 'Profile',
         type: 'item',
         url: '/Profile',
         icon: icons.ChromeOutlined
       },
       {
           id: 'FaceDetection',
           title: 'Face Detection',
           type: 'item',
           url: '/faceDetection',
           icon: icons.IdcardOutlined, // Updated icon
         },
       {
         id: 'Password Change',
         title: 'Password Change',
         type: 'item',
         url: '/PasswordChange',
         icon: icons.QuestionOutlined,
       },
       {
         id: 'SongUpload',
         title: 'Song Upload',
         type: 'item',
         url: '/SongUpload',
         icon: icons.QuestionOutlined,
       },
       {
         id: 'AllSongsTable',
         title: 'AllSongsTable',
         type: 'item',
         url: '/AllSongsTable',
         icon: icons.QuestionOutlined,
       },
       {
         id: 'UserTable',
         title: 'User Table',
         type: 'item',
         url: '/UserTable',
         icon: icons.QuestionOutlined,
       },
       {
         id: 'FavoriteSongs',
         title: 'Favorite Songs',
         type: 'item',
         url: '/FavoriteSongs',
         icon: icons.HeartOutlined,
       },
       {
         id: 'RecommendationSongs',
         title: 'Playing songs',
         type: 'item',
         url: '/RecommendationSongs',
         icon: icons.ProfileOutlined,
         target: false
       }
  ]
};

export default pages;
