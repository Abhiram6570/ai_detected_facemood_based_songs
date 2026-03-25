import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import { useUser } from '../../../../../components/UserContext'; 



// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { logout } = useUser();

  const { user } = useUser(); 


    useEffect(()=>{
         
        if (!user) {
            return (
              <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">User not logged in. Please log in to change your password.</Alert>
              </Container>
            );
    }
    });

    const handleListItemClick = (index, route) => {
        setSelectedIndex(index);
        navigate(route);
       
    };

    return (
        <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
            <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1, "/Profile")}>
                <ListItemIcon>
                    <UserOutlined />
                </ListItemIcon>
                <ListItemText primary="View Profile" />
            </ListItemButton>

            <ListItemButton selected={selectedIndex === 3} onClick={() => handleListItemClick(3, '/PasswordChange')}>
                <ListItemIcon>
                    <ProfileOutlined />
                </ListItemIcon>
                <ListItemText primary="Password Change" />
            </ListItemButton>

            <ListItemButton selected={selectedIndex === 2} onClick={() => logout()}>
                <ListItemIcon>
                    <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </List>
    );
}

ProfileTab.propTypes = {
    handleLogout: PropTypes.func.isRequired,
};
