import { Alert, AlertTitle } from "@mui/material";
import { ReactNode } from "react";

interface WarningProps {
  /**
   * The warning message to display
   */
  children: ReactNode
}

/**
 * Displays an amber MUI warning Alert with a "Watch out!" heading.
 */
export default function Warning (props: WarningProps){
  return <Alert severity="warning">
    <AlertTitle>Watch out!</AlertTitle>
    {props.children}
  </Alert>
}