import { Alert, AlertTitle, Button, SxProps } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ReactNode, useEffect } from "react";

interface ErrorProps {
  /** An RTK Query `FetchBaseQueryError` or Redux `SerializedError` to display. */
  error?: FetchBaseQueryError | SerializedError
  /** Additional message content rendered above the parsed error detail. */
  children?: ReactNode
  /** When true, adds a bottom margin below the alert. */
  gutterBottom?: boolean
  /** When true, suppresses the automatic scroll-to-top triggered on mount. */
  noJump?: boolean
  /** When provided, a "Try Again" button is shown that calls this function. */
  onRetry?: () => void
}

function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Displays an error inside a red MUI Alert with an "Oh no!" heading.
 *
 * Handles RTK Query `FetchBaseQueryError` (showing the `message`, optional
 * `detail`, and HTTP status code) and Redux `SerializedError` (shown as JSON).
 * Scrolls the page to the top on mount so the error is always visible, unless
 * `noJump` is set.
 */
export default function Error(props: ErrorProps){

  useEffect(() => {
    if(!props.noJump){
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [props])

  let message = null
  let detail = null
  let status = null

  if (isFetchBaseQueryError(props.error)) {
    const data = props.error.data as { message?: string, detail?: string | string[] };

    status = <p><small>Status Code: {props.error.status}</small></p>

    if (data?.message) {
      message = <p>{data.message}</p>;
    } else {
      message = <code>{JSON.stringify(props.error)}</code>;
    }

    if(data.detail){
      if(Array.isArray(data.detail)){
        detail = <ul>
          {data.detail.map((x,idx) => <li key={"error_detail_"+idx}>{x}</li>)}
        </ul>
      }else{
        detail = <p>{data.detail}</p>
      }
    }
  } else if (props.error) {
    message = <code>{JSON.stringify(props.error)}</code>;
  }

  const sx: SxProps = {
    ...(props.gutterBottom && { marginBottom: '1rem' }),
  };
  
  return <Alert severity="error" sx={sx}>
    <AlertTitle>Oh no!</AlertTitle>
    {props.children}
    {message}
    {detail}
    {status}
    {props.onRetry ? <p><Button variant="outlined" color="error" onClick={props.onRetry}>Try Again</Button></p> : null}
  </Alert>
}