import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavGroup from './NavGroup';
import UtilitiesMenu from '../../../../../menu-items/utilities'; // Adjust path if necessary

const Navigation = () => {
  const utilities = UtilitiesMenu(); // Get utilities dynamically
  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
    },
    utilities, // Add utilities dynamically based on user type
  ].filter(Boolean); // Remove null items

  const navGroups = menuItems.map((item) => {
    // Check if item is a group or an item and render accordingly
    if (item.type === 'group') {
      return <NavGroup key={item.id} item={item} />;
    }

    // If it's not a group, render a fallback message
    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        {/* Fix - Navigation Group */}
      </Typography>
    );
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
