import { Link } from "@mui/material";
import { JSX } from "react";

interface EmailLinkProps {
  /**
   * Element (or string) containing e-mail address which we should link to.
   */ 
  children: string | JSX.Element
}

export default function EmailLink(props: EmailLinkProps){
  if(!props.children)
    return null

  const s = String(props.children).toLowerCase()
  return <Link href={"mailto:"+s}>{s}</Link>
}