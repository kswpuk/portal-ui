import { Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface IconTextProps {
  gap?: string | number
  marginBottom?: string | number

  icon: ReactNode
  children: ReactNode
}

export default function IconText(props: IconTextProps){
  return <Typography component={Stack} direction="row" alignItems="center" gap={props.gap || 2} sx={{marginBottom: props.marginBottom || '1rem'}}>
    {props.icon}
    {props.children}
  </Typography>
}