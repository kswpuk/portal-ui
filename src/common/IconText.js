import { Stack, Typography } from "@mui/material";

export default function IconText(props){
  return <Typography component={Stack} direction="row" alignItems="center" gap={props.gap || 2} sx={{marginBottom: props.marginBottom || '1rem'}}>
    {props.icon}
    {props.children}
  </Typography>
}