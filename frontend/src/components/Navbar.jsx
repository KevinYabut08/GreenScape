import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/img/Logo.png'; 
import ProfilePic from '../assets/img/Profile.jpg';
import { Link, useLocation } from 'react-router-dom';


const drawerWidth = 300;

export default function Navbar(props) {
  const {content} = props
  const location = useLocation()
  const path = location.pathname

  return (
    <Box sx={{ display: 'flex'}}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' ,backgroundColor: '#F8F8F8',color: '#0A8341'},
        }}
      >
        <Toolbar />
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, mb: 1 }}>
        <img src={Logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
        </Box>

        {/* Profile Picture */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, mb: 3 }}>
        <img src={ProfilePic} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0A8341' }} />
        </Box>

        <Typography
        sx={{ mb: 6, textAlign: 'center', color: '#0A8341'}}
        >
            Welcome, User!
        </Typography>

        <Box sx={{ overflow: 'auto' }}>
          <List>
            {/* Dashboard Page */}
              <ListItem key={1} disablePadding>
                <ListItemButton component={Link} to="/home" selected={"/home" === path}>
                  <ListItemIcon>
                    <DashboardIcon sx={{ color:'#0A8341'}}/> 
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>
              </ListItem>
            {/* Services Page */}
              <ListItem key={2} disablePadding>
                <ListItemButton component={Link} to="/services" selected={"/services" === path}>
                  <ListItemIcon>
                    <WaterDropIcon sx={{ color:'#0A8341'}}/>
                  </ListItemIcon>
                  <ListItemText primary={"Services"} />
                </ListItemButton>
              </ListItem>
            {/* Booking Page */}
              <ListItem key={3} disablePadding>
                <ListItemButton component={Link} to="/booking" selected={"/booking" === path}>
                  <ListItemIcon>
                    <CalendarMonthIcon sx={{ color:'#0A8341'}}/>
                  </ListItemIcon>
                  <ListItemText primary={"Booking"} />
                </ListItemButton>
              </ListItem>
            {/* Settings Page */}
              <ListItem key={4} disablePadding>
                <ListItemButton component={Link} to="/settings" selected={"/settings" === path}>
                  <ListItemIcon>
                    <SettingsIcon sx={{ color:'#0A8341'}}/>
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                </ListItemButton>
              </ListItem>
            {/* Logout */}
              <ListItem key={5} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color:'#0A8341'}}/>
                  </ListItemIcon>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </ListItem>

          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
