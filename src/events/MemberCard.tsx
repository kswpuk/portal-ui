import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from '@mui/material';
import { Spa, Star } from '@mui/icons-material';
import MemberPhoto from '../common/MemberPhoto';
import Privileged from '../common/Privileged';
import { Link } from "react-router-dom";
import { ALLOCATED, ATTENDED } from '../consts';

interface MemberCardProps {
  membershipNumber: string
  name?: string
  experience?: number
  allocation?: AllocationStatus
}

export default function MemberCard(props: MemberCardProps) {
  if (!props.membershipNumber) {
    return null
  }

  const isAllocated = props.allocation === undefined || props.allocation === ALLOCATED || props.allocation === ATTENDED;

  return <Card variant='outlined'>
    <CardHeader title={props.name || props.membershipNumber} subheader={props.name ? props.membershipNumber : null} />
    <CardContent>
      <MemberPhoto membershipNumber={props.membershipNumber} title={props.name || props.membershipNumber} />
      {isAllocated && props.experience !== undefined && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {props.experience === 0 ? (
            <Chip size="small" icon={<Spa />} label="First Timer" sx={{ backgroundColor: "#007b41", color: '#fff', '& .MuiChip-icon': { color: '#fff' } }} />
          ) : props.experience >= 3 ? (
            <Chip
              size="small"
              icon={<Star />}
              label={`Pro (${props.experience} events)`}
              sx={{ backgroundColor: (theme) => theme.palette.secondary.main, color: '#fff', '& .MuiChip-icon': { color: '#fff' } }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Has attended this event {props.experience} {props.experience === 1 ? 'time' : 'times'}
            </Typography>
          )}
        </Box>
      )}
    </CardContent>
    <Privileged allowed={["COMMITTEE"]}>
      <CardActions>
        <Button component={Link} to={`/members/${props.membershipNumber}/view`}>View Member</Button>
      </CardActions>
    </Privileged>
  </Card>
}