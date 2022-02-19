import { Alert, AlertTitle } from "@mui/material";

export default function Success (props){
  return <Alert severity="success">
    <AlertTitle>Hooray!</AlertTitle>
    {props.children}
  </Alert>
}