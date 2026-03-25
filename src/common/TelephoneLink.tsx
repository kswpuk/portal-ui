import { Link } from "@mui/material";
import { JSX } from "react";

interface TelephoneLinkProps {
    /**
     * Element (or string) containing the phone number which we should display.
     */ 
    children: string | JSX.Element
}

/**
 * Normalises a phone number and renders it as a `tel:` hyperlink.
 *
 * Non-numeric characters (except a leading `+`) are stripped. A UK number
 * starting with `0` has the leading zero replaced with the `+44` country code.
 */
export default function TelephoneLink(props: TelephoneLinkProps){
  let number = String(props.children).replaceAll(/[^+0-9]/g, '')
  if(number.startsWith('0')){
    number = '+44' + number.substring(1)
  }

  return <Link href={"tel:"+number}>{number}</Link>
}