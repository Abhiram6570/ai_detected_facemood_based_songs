// assets
import {
  DashboardOutlined,    // New icon for Dashboard
  IdcardOutlined,       // New icon for Face Detection
  FileSearchOutlined,   // New icon for Manual Select Songs
  UploadOutlined,       // New icon for Song Upload (admin)
  UserOutlined,         // New icon for Profile
  LockOutlined,
  HeartOutlined,
  TableOutlined          // New icon for Change Password
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  IdcardOutlined,
  FileSearchOutlined,
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  HeartOutlined,
  TableOutlined
};

import { useUser } from '../components/UserContext';

const UtilitiesMenu = () => {
  const { user } = useUser(); // Get user data from context


  const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: []
  };

  // Always add other utility paths

  utilities.children.push({
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    icon: icons.DashboardOutlined, // Updated icon
  });
  

  utilities.children.push({
    id: 'FaceDetection',
    title: 'Face Detection',
    type: 'item',
    url: '/faceDetection',
    icon: icons.IdcardOutlined, // Updated icon
  });

  utilities.children.push({
    id: 'ManuvalSelectSongs',
    title: 'Manual Select Songs',
    type: 'item',
    url: '/ManuvalSelectSongs',
    icon: icons.FileSearchOutlined, // Updated icon
  });
  
  // Always add the Song Upload path if user type is 1 (admin)
  if (user && user.type === 1) {
    utilities.children.push({
      id: 'SongUpload',
      title: 'Song Upload',
      type: 'item',
      url: '/SongUpload',
      icon: icons.UploadOutlined, // Updated icon
    });
  }

  utilities.children.push({
    id: 'FavoriteSongs',
    title: 'Favorite Songs',
    type: 'item',
    url: '/FavoriteSongs',
    icon: icons.HeartOutlined, // Updated icon
  });


  if (user && user.type === 1) {
    utilities.children.push({
      id: 'AllSongsTable',
      title: 'AllSongsTable',
      type: 'item',
      url: '/AllSongsTable',
      icon: icons.TableOutlined, // Updated icon
    });   
  }

  if (user && user.type === 1) {
    utilities.children.push({
      id: 'UserTable',
      title: 'User Table',
   type: 'item',
      url: '/UserTable',
      icon: icons.TableOutlined, // Updated icon
    });   
  }


  utilities.children.push({
    id: 'Profile',
    title: 'Profile',
    type: 'item',
    url: '/Profile',
    icon: icons.UserOutlined, // Updated icon
  });

  utilities.children.push({
    id: 'PasswordChange',
    title: 'Change Password',
    type: 'item',
    url: '/PasswordChange',
    icon: icons.LockOutlined, // Updated icon
  });


  

  return utilities; // Return the complete utilities object
};

export default UtilitiesMenu;
