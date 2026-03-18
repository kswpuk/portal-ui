import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { drawerWidth } from "../consts";
import { useAppSelector } from "../redux/hooks";

interface HeaderProps {
  /**
   * Function that should be called when the user requests to toggle the drawer
   */ 
  toggleDrawer: () => void
}

export default function Header(props: HeaderProps) {
  const title = useAppSelector((state) => state.nav.title)

  return <>
    <title>{title ? title + " - KSWP Portal": "KSWP Portal"}</title>
    <AppBar position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
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