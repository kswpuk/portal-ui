import { useTheme } from "@mui/material";

export default function DateOfBirth(props){
  const s = String(props.children)
  const theme = useTheme();

  const dob = Date.parse(s)
  if(isNaN(dob)){
    return s
  }else {
    const age = (new Date(Date.now() - dob)).getUTCFullYear() - 1970
    return <><time dateTime={s}>{s}</time> <span style={{color: theme.palette.text.secondary}}>({age} years old)</span></>
  }
}