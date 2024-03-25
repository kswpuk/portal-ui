import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useSelector } from 'react-redux'
import { drawerWidth } from "../consts";

export default function Header(props) {
  const title = useSelector((state) => state.nav.title)

  return <>
    <Helmet>
      <title>{title ? title + " - ": ""}KSWP Portal</title>
    </Helmet>
    <AppBar position="fixed" 
      sx={{ 
        // zIndex: (theme) => theme.zIndex.drawer + 1
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px`}
      }}>
      <Toolbar variant='dense'>
        <IconButton edge="start" color="inherit" onClick={props.toggleDrawer} sx={{ mr: 2, display: { sm: 'none' } }}>
          <Menu />
        </IconButton>

        {title ? <Typography variant="h6" noWrap component="div"> {title} </Typography> : null }
      </Toolbar>
    </AppBar>
  </>
}