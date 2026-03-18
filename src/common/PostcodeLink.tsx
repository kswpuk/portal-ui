import { Link } from "@mui/material"
import { ReactNode } from "react"

interface PostcodeLinkProps {
  children?: ReactNode
}

export default function PostcodeLink(props: PostcodeLinkProps){
  if(!props.children)
    return null
  
  let postcode = String(props.children).toUpperCase().replaceAll(/[^+A-Z0-9]/g, '')
  postcode = postcode.substring(0, postcode.length - 3) + " " + postcode.substring(postcode.length - 3)

  return <Link href={"https://www.google.co.uk/maps/place/"+postcode} target="_blank" rel="noreferrer">{postcode}</Link>
}