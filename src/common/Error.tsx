import { Alert, AlertTitle, Button, SxProps } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ReactNode, useEffect } from "react";

interface ErrorProps {
  error?: FetchBaseQueryError | SerializedError

  children?: ReactNode

  gutterBottom?: boolean
  noJump?: boolean
  onRetry?: () => void
}

function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

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