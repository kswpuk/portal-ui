import { HelpOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

interface HelpProps {
  /** Content shown inside the tooltip when the user hovers over the icon. */
  children: import("react").ReactNode
}

/**
 * A small inline help icon that reveals tooltip content on hover.
 *
 * Renders a MUI `HelpOutline` icon styled for inline use next to labels or headings.
 */
export default function Help(props: HelpProps){
  return <Tooltip title={props.children}>
    <HelpOutline fontSize="small" sx={{ml: '1rem', verticalAlign: "middle"}} color="primary" />
  </Tooltip>
}