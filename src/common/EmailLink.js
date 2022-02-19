import { Link } from "@mui/material";

export default function EmailLink(props){
  const s = String(props.children).toLowerCase()

  return <Link href={"mailto:"+s}>{s}</Link>
}