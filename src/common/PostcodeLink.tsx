import { Link } from "@mui/material"
import { ReactNode } from "react"

interface PostcodeLinkProps {
  /** The postcode string to normalise and link. Returns `null` if not provided. */
  children?: ReactNode
}

/**
 * Normalises a UK postcode and links it to Google Maps.
 *
 * Uppercases the input, strips non-alphanumeric characters, then inserts a
 * space before the final three characters to produce the standard format
 * (e.g. `"SW1A 2AA"`). Returns `null` if no value is provided.
 */
export default function PostcodeLink(props: PostcodeLinkProps){
  if(!props.children)
    return null
  
  let postcode = String(props.children).toUpperCase().replaceAll(/[^+A-Z0-9]/g, '')
  postcode = postcode.substring(0, postcode.length - 3) + " " + postcode.substring(postcode.length - 3)

  return <Link href={"https://www.google.co.uk/maps/place/"+postcode} target="_blank" rel="noreferrer">{postcode}</Link>
}