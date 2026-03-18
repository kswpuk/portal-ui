import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';

interface AllocationSuspendedWidgetProps {
  suspended: boolean
}

export default function AllocationSuspendedWidget(props: AllocationSuspendedWidgetProps){
  if (props.suspended) {
    return <Tooltip title="This member is currently suspended">
      <BlockIcon fontSize="small" sx={{ml: '0.3rem', verticalAlign: "middle"}} color="primary" />
    </Tooltip>
  } else {
    return null
  }
}