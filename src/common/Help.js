import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export default function Help(props){
  return <Tooltip title={props.children}>
    <HelpOutline fontSize="small" sx={{ml: '1rem', verticalAlign: "middle"}} color="primary" />
  </Tooltip>
}