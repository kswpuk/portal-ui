import { Alert, AlertTitle, Button } from "@mui/material";
import { useEffect } from "react";

export default function Error(props){

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  let message = null
  if(props.error?.data?.message){
    message = <p>{props.error.data.message}</p>
  }else if(props.error){
    message = <code>{JSON.stringify(props.error)}</code>
  }

  let detail = null
  if(props.error?.data?.detail){
    if(Array.isArray(props.error.data.detail)){
      detail = <ul>
        {props.error.data.detail.map((x,idx) => <li key={"error_detail_"+idx}>{x}</li>)}
      </ul>
    }else{
      detail = <p>{props.error.data.detail}</p>
    }
  }

  let sx = {}
  if(props.gutterBottom){
    sx['marginBottom'] = '1rem'
  }
  
  return <Alert severity="error" sx={sx}>
    <AlertTitle>Oh no!</AlertTitle>
    {props.children}
    {message}
    {detail}
    {props.error?.status ? <p><small>Status Code: {props.error.status}</small></p> : null}
    {props.onRetry ? <p><Button variant="outlined" color="error" onClick={() => props.onRetry()}>Try Again</Button></p> : null}
  </Alert>
}