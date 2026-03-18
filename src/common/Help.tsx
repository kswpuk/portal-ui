import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

interface HelpProps {
  children: import("react").ReactNode
}

export default function Help(props: HelpProps){
  return <Tooltip title={props.children}>
    <HelpOutline fontSize="small" sx={{ml: '1rem', verticalAlign: "middle"}} color="primary" />
  </Tooltip>
}