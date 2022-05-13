import { Alert, AlertTitle } from "@mui/material";

export default function Warning (props){
  return <Alert severity="warning">
    <AlertTitle>Watch out!</AlertTitle>
    {props.children}
  </Alert>
}