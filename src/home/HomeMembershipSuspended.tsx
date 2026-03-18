import { Alert, AlertTitle, Link as MUILink, Typography } from "@mui/material";


export default function HomeMembershipSuspended() {
  return <Alert severity="error">
      <AlertTitle>Membership suspended</AlertTitle>
      <Typography variant="body1" gutterBottom>
        You are currently suspended from the KSWP.
        This may be due to your DBS expiring, being out of date on your mandatory training, or some other reason.
        If you are not aware of the reason for your suspension, please contact the <MUILink href="mailto:members@kswp.org.uk">Membership Coordinator</MUILink>.
      </Typography>
      <Typography variant="body1">
        Until your suspension has been lifted, you will not be able to attend events or sign up to future events.
      </Typography>
    </Alert>
}