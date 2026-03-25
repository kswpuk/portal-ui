import { Link } from "@mui/material";
import { JSX } from "react";

interface EmailLinkProps {
  /**
   * Element (or string) containing e-mail address which we should link to.
   */ 
  children: string | JSX.Element
}

/**
 * Renders an email address as a `mailto:` hyperlink.
 *
 * The address is lower-cased before rendering. Returns `null` if no value is provided.
 */
export default function EmailLink(props: EmailLinkProps){
  if(!props.children)
    return null

  const s = String(props.children).toLowerCase()
  return <Link href={"mailto:"+s}>{s}</Link>
}