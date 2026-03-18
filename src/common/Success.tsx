import { Alert, AlertTitle } from "@mui/material";
import { ReactNode } from "react";

interface SuccessProps {
  /**
   * The success message to display
   */
  children: ReactNode
}

export default function Success (props: SuccessProps){
  return <Alert severity="success">
    <AlertTitle>Hooray!</AlertTitle>
    {props.children}
  </Alert>
}