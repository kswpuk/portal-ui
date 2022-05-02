import { Link } from "@mui/material";

export default function EmailLink(props){
  if(!props.children)
    return null

  const s = String(props.children).toLowerCase()
  return <Link href={"mailto:"+s}>{s}</Link>
}