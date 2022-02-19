import { Approval, BarChart, Close, Event, Home, Logout, Password, People, Person, PhotoCamera, ShoppingBag } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { drawerWidth } from '../consts';
import { APPLICATIONS, CHANGE_PASSWORD, EVENTS, HOME, MEMBERS, PHOTO, REPORT, SHOP, USER } from '../redux/navSlice';
import { useTheme } from '@mui/material/styles';

export default function Sidebar(props) {
  const selected = useSelector((state) => state.nav.selected)
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerContent = <>
    <Toolbar variant='dense'>
      <Typography variant="h6" noWrap component="div" flex={1}>
        QSWP Portal
      </Typography>
      { isMobile ? <IconButton onClick={props.onDrawerClose}><Close /></IconButton> :  null }
    </Toolbar>
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItemButton component={Link} to="/" selected={selected === HOME}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton component={Link} to="/applications" selected={selected === APPLICATIONS}>
          <ListItemIcon>
            <Approval />
          </ListItemIcon>
          <ListItemText primary="Applications" />
        </ListItemButton>

        <ListItemButton component={Link} to="/events" selected={selected === EVENTS}>
          <ListItemIcon>
            <Event />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItemButton>
        
        <ListItemButton component={Link} to="/members" selected={selected === MEMBERS}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Members" />
        </ListItemButton>

        <ListItemButton component={Link} to="/report" selected={selected === REPORT}>
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </ListItemButton>

        <ListItemButton component={Link} to="/shop" selected={selected === SHOP}>
          <ListItemIcon>
            <ShoppingBag />
          </ListItemIcon>
          <ListItemText primary="Shop" />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListSubheader>Member {props.username}</ListSubheader>
        <ListItemButton component={Link} to={"/user"} selected={selected === USER}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="My Details" />
        </ListItemButton>

        <ListItemButton component={Link} to={"/user/photo"} selected={selected === PHOTO}>
          <ListItemIcon>
            <PhotoCamera />
          </ListItemIcon>
          <ListItemText primary="My Photo" />
        </ListItemButton>

        <ListItemButton component={Link} to="/user/password" selected={selected === CHANGE_PASSWORD}>
          <ListItemIcon>
            <Password />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>

        <ListItemButton onClick={props.signOut}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </List>
    </Box>
  </>

  let drawer = null;
  if(isMobile){
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    drawer = <Drawer
      container={container}
      variant="temporary"
      open={props.isOpen}
      onClose={props.onDrawerClose}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawerContent}
    </Drawer>
  }else{
    drawer = <Drawer
      variant="permanent"
      open
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawerContent}
    </Drawer>
  }

  return <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
    {drawer}
  </Box>
}