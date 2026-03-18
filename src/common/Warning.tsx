import { Alert, AlertTitle } from "@mui/material";
import { ReactNode } from "react";

interface WarningProps {
  /**
   * The success message to display
   */
  children: ReactNode
}

export default function Warning (props: WarningProps){
  return <Alert severity="warning">
    <AlertTitle>Watch out!</AlertTitle>
    {props.children}
  </Alert>
}