import { Box, CircularProgress } from "@mui/material"
import { useGetMemberPhotoQuery } from "../redux/membersApi"
import noPhoto from "./unknown.png"

export default function MemberPhoto(props){
  const { data: url, error, isLoading } = useGetMemberPhotoQuery(props.membershipNumber, {pollingInterval: 3600000})

  const imgStyle = {
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    objectFit: 'cover', 
    width: '100%',
  }

  if(isLoading){
    return <Box width={props.width} height={props.height} sx={{display: 'flex'}}>
      <CircularProgress sx={{alignSelf: 'center', margin: 'auto', mt: '1rem', mb: '1rem'}} />
    </Box>
  }else if(error){
    return <img style={imgStyle} src={noPhoto} alt="" title={props.title || "No photo"} width={props.width} height={props.height} />
  }

  return <img 
    className="MuiCardMedia-root MuiCardMedia-media MuiCardMedia-img"
    style={imgStyle}
    src={url} width={props.width} height={props.height} alt={props.alt} title={props.title} />
}