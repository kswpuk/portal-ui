import { Box, CircularProgress } from "@mui/material"
import { Auth } from "aws-amplify";
import { useState } from "react";
import useFetch from "react-fetch-hook";
import { baseUrl } from "../consts";
import noPhoto from "./unknown.png"

export default function MemberPhoto(props){
  const [token, setToken] = useState(null)

  Auth.currentSession().then(session => {
    setToken(session.getAccessToken().getJwtToken())
  })

  const { data: image, isLoading, error } = useFetch(baseUrl + "members/" + props.membershipNumber + "/photo", {
    depends: [token],
    formatter: (response) => response.blob(),
    headers: {
      "Authorization": "Bearer "+token
    },
  });

  const imgStyle = {
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    objectFit: 'cover', 
    width: '100%'
  }

  //TODO: Why do we need to check the type? error returns undefined, regardless of whether the fetch fails or not
  if(error || image?.type !== "image/jpeg" ){
    return <img style={imgStyle} src={noPhoto} alt="" title="No photo" width={props.width} height={props.height} />
  }else if(isLoading){
    return <Box {...props} sx={{display: 'flex'}}>
      <CircularProgress sx={{alignSelf: 'center', margin: 'auto', mt: '1rem', mb: '1rem'}} />
    </Box>
  }

  if(!image)
    return null

  const img = URL.createObjectURL(image)

  return <img 
    className="MuiCardMedia-root MuiCardMedia-media MuiCardMedia-img"
    style={imgStyle}
    src={img} onLoad={() => URL.revokeObjectURL(img)} width={props.width} height={props.height} alt={props.alt} />
}