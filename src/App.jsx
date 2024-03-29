import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import { Route, Routes } from 'react-router-dom';
import { drawerWidth } from './consts';
import { lazy } from 'react';
import { Suspense } from 'react';
import Loading from './common/Loading';

export default function App(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const LoadingSuspense = (props) => {
    return <Suspense fallback={<Loading />}> 
      {props.children}
    </Suspense>
  }

  const LazyHome = lazy(() => import('./home/Home'));
  const LazyApplications = lazy(() => import('./applications/Applications'));
  const LazyEvents = lazy(() => import('./events/Events'));
  const LazyMembers = lazy(() => import('./members/Members'));
  const LazyReport = lazy(() => import('./report/Report'));
  const LazyShop = lazy(() => import('./shop/Shop'));
  const LazyUser = lazy(() => import('./user/User'));
  const LazyUserPhoto = lazy(() => import('./user/UserPhoto'));
  const LazyChangePassword = lazy(() => import('./user/ChangePassword'));
  const LazyPayMembership = lazy(() => import('./user/PayMembership'));

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header toggleDrawer={handleDrawerToggle} />
      <Sidebar isOpen={mobileOpen} onDrawerClose={handleDrawerToggle} username={props.user.username} signOut={props.signOut} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar variant='dense'/>
        <Routes>
          <Route path="/applications/*" element={<LoadingSuspense><LazyApplications /></LoadingSuspense>} />
          <Route path="/events/*" element={<LoadingSuspense><LazyEvents /></LoadingSuspense>} />
          <Route path="/members/*" element={<LoadingSuspense><LazyMembers /></LoadingSuspense>} />
          <Route path="/report" element={<LoadingSuspense><LazyReport /></LoadingSuspense>} />
          <Route path="/shop" element={<LoadingSuspense><LazyShop /></LoadingSuspense>} />

          <Route path="/user" element={<LoadingSuspense><LazyUser /></LoadingSuspense>} />
          <Route path="/user/photo" element={<LoadingSuspense><LazyUserPhoto /></LoadingSuspense>} />
          <Route path="/user/password" element={<LoadingSuspense><LazyChangePassword /></LoadingSuspense>} />
          <Route path="/user/pay" element={<LoadingSuspense><LazyPayMembership /></LoadingSuspense>} />

          <Route path="/" element={<LoadingSuspense><LazyHome /></LoadingSuspense>} />
        </Routes>
      </Box>
    </Box>
  );
}
