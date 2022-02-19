import { Alert, AlertTitle, Button } from "@mui/material";

export default function Error(props){

  let message = null
  if(props.error.data?.message){
    message = <p>{props.error.data.message}</p>
  }else{
    message = <code>{JSON.stringify(props.error)}</code>
  }

  let detail = null
  if(props.error.data?.detail){
    if(Array.isArray(props.error.data.detail)){
      detail = <ul>
        {props.error.data.detail.map((x,idx) => <li key={"error_detail_"+idx}>{x}</li>)}
      </ul>
    }else{
      detail = <p>{props.error.data.detail}</p>
    }
  }
  
  return <Alert severity="error">
    <AlertTitle>Oh no!</AlertTitle>
    {props.children}
    {message}
    {detail}
    {props.error?.status ? <small>Status Code: {props.error.status}</small> : null}
    {props.onRetry ? <p><Button variant="outlined" color="error" onClick={() => props.onRetry()}>Try Again</Button></p> : null}
  </Alert>
}