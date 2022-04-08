import { Facebook, Instagram, Link as LinkIcon, Twitter } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Link } from "@mui/material";
import IconText from "../common/IconText";

export default function HomeOtherSocialMedia(props) {
  return <Card>
    <CardHeader title="Social Media" />
    <CardContent>
      <IconText icon={<Facebook />}><Link href="https://www.facebook.com/groups/QSWP1" target="_blank">Facebook Group</Link></IconText>
      <IconText icon={<Facebook />}><Link href="https://www.facebook.com/NationalQSWP" target="_blank">Facebook Page</Link></IconText>
      <IconText icon={<Instagram />}><Link href="https://www.instagram.com/qswp_uk" target="_blank">Instagram</Link></IconText>
      <IconText icon={<Twitter />}><Link href="https://twitter.com/qswp_uk" target="_blank">Twitter</Link></IconText>
      <IconText icon={<LinkIcon />}><Link href="http://www.qswp.org.uk" target="_blank">QSWP Website</Link></IconText>
    </CardContent>
  </Card>
}