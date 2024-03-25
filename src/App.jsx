import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { Route, Routes } from 'react-router-dom';
import Members from './members/Members';
import Events from './events/Events';
import Report from './report/Report';
import Applications from './applications/Applications';
import Home from './home/Home';
import Shop from './shop/Shop';
import User from './user/User';
import ChangePassword from './user/ChangePassword';
import { drawerWidth } from './consts';
import UserPhoto from './user/UserPhoto';
import PayMembership from './user/PayMembership';

export default function App(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header toggleDrawer={handleDrawerToggle} />
      <Sidebar isOpen={mobileOpen} onDrawerClose={handleDrawerToggle} username={props.user.username} signOut={props.signOut} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar variant='dense'/>
        <Routes>
          <Route path="/applications/*" element={<Applications />} />
          <Route path="/events/*" element={<Events />} />
          <Route path="/members/*" element={<Members />} />
          <Route path="/report" element={<Report />} />
          <Route path="/shop" element={<Shop />} />

          <Route path="/user" element={<User />} />
          <Route path="/user/photo" element={<UserPhoto />} />
          <Route path="/user/password" element={<ChangePassword />} />
          <Route path="/user/pay" element={<PayMembership />} />

          <Route path="/" element={<Home />} />
        </Routes>
      </Box>
    </Box>
  );
}
