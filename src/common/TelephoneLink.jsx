import { Link } from "@mui/material";

export default function TelephoneLink(props){
  let number = String(props.children).replaceAll(/[^+0-9]/g, '')
  if(number.startsWith('0')){
    number = '+44' + number.substring(1)
  }

  return <Link href={"tel:"+number}>{number}</Link>
}