import { Box, CircularProgress } from "@mui/material"
import noPhoto from "../common/unknown.png"
import { useGetApplicationEvidenceQuery } from "../redux/applicationsApi";
import React from "react";

interface EvidenceImageProps {
  /**
   * Membership number of the application
   */ 
  membershipNumber: string

  /**
   * Image alt text
   */
  alt?: string

  /**
   * Image height
   */
  height?: number

  /**
   * Image title
   */
  title?: string

  /**
   * Image width
   */
  width?: number
}

export default function EvidenceImage(props: EvidenceImageProps){
  const { data: url, error, isLoading } = useGetApplicationEvidenceQuery(props.membershipNumber, {pollingInterval: 600000})

  const imgStyle: React.CSSProperties = {
    display: 'block',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    objectFit: 'cover', 
    width: '100%',
  }

  if(isLoading){
    return <Box sx={{display: 'flex', width: props.width, height: props.height}}>
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