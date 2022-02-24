import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";

export default function Join(props){
  return <>
    <AppBar position="fixed">
      <Toolbar variant='dense'>
        <Container sx={{display: 'flex'}}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}> Queen's Scout Working Party </Typography>
          <Button component={Link} color="inherit" variant="outlined" to="/">Already a member?</Button>
        </Container>
      </Toolbar>
    </AppBar>
    <Container sx={{mb: '2rem'}}>
      <Toolbar variant='dense' sx={{mb: '1rem'}} />
      <Routes>
        <Route path="/" element={<ApplicationForm />} />
      </Routes>
    </Container>
  </>
}