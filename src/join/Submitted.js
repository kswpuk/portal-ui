import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom'

export default function Submitted(props){
  return <>
    <Typography variant="h4" gutterBottom>Application Received</Typography>
    <Typography variant="body1" gutterBottom>
      Thank you for your application to join the Queen's Scout Working Party.
      We have received your application, and will shortly be sending out e-mails to your referees asking them to complete a reference form.
      Please ask your referees to respond promptly to the request, as we are not able to progress your application until we have received references from both a Scouting and a non-Scouting referee.
    </Typography>
    <Typography variant="body1" gutterBottom>
      We will be in touch once we have approved your application, or if we have any further queries regarding it.
      If you have any questions, you can contact our Membership Coordinator at <Link href="mailto:members@qswp.org.uk">members@qswp.org.uk</Link>.
      You can <Link to="/join/status" component={RouterLink}>check on the status of your application</Link> online.
    </Typography>
  </>
}