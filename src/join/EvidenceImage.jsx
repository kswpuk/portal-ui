import { Box, CircularProgress } from "@mui/material"
import { fetchAuthSession } from 'aws-amplify/auth'
import { useState } from "react";
import useFetch from "react-fetch-hook";
import { baseUrl } from "../consts";
import noPhoto from "../common/unknown.png"

export default function EvidenceImage(props){
  const [token, setToken] = useState(null)

  fetchAuthSession().then(session => {
    setToken(session.tokens?.accessToken.toString())
  })

  const { data: image, isLoading, error } = useFetch(baseUrl + "applications/" + props.membershipNumber + "/evidence", {
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
    objectFit: 'contain', 
    maxWidth: '100%',
    maxHeight: '80%'
  }

  //TODO: Why do we need to check the type? error returns undefined, regardless of whether the fetch fails or not
  if(error || image?.type !== "image/jpeg" ){
    return <img style={imgStyle} src={noPhoto} alt="" title="No photo" width={props.width} height={props.height} />
  }else if(isLoading){
    return <Box width={props.width} height={props.height} sx={{display: 'flex'}}>
      <CircularProgress sx={{alignSelf: 'center', margin: 'auto', mt: '1rem', mb: '1rem'}} />
    </Box>
  }

  if(!image)
    return null

  const img = URL.createObjectURL(image)

  return <img 
    style={imgStyle}
    src={img} onLoad={() => URL.revokeObjectURL(img)} width={props.width} height={props.height} alt={props.alt} />
}