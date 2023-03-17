import { Card, CardContent, CardHeader, Link, Typography } from "@mui/material";

export default function HomeOtherEmails(props) {
  return <Card>
    <CardHeader title="Mailing List" />
    <CardContent>
      <Typography variant="body2" gutterBottom>
        As a member of the KSWP, you are automatically subscribed to our mailing list and we will update your subscription whenever you update your e-mail.
      </Typography>
      <Typography variant="body2">
        You can view old e-mails that have been sent to the KSWP mailing list via <Link href="https://us1.campaign-archive.com/home/?u=8a8742aba11976a05e667cff8&amp;id=1edce4b389">our online MailChimp archive</Link>.
      </Typography>
    </CardContent>
  </Card>
}