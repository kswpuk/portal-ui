import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';

export default function AllocationSuspendedWidget(props){
  if (props.suspended) {
    return <Tooltip title="This member is currently suspended">
      <BlockIcon fontSize="x-small" sx={{ml: '0.3rem', verticalAlign: "middle"}} color="primary" />
    </Tooltip>
  } else {
    return null
  }
}