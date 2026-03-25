import { Box, CircularProgress } from "@mui/material"
import { useGetMemberPhotoQuery } from "../redux/membersApi"
import noPhoto from "./unknown.png"

interface MemberPhotoProps {
  /**
   * Membership number of the member whose photo you want to display
   */
  membershipNumber: string

  /**
   * Image alt text
   */
  alt?: string

  /**
   * Image height
   */
  height?: number | string

/**
   * Image title
   */
  title?: string

  /**
   * Image width
   */
  width?: number | string
}

/**
 * Fetches and displays a member's photo via the members API.
 *
 * Shows a spinner while the photo is loading. Falls back to a placeholder
 * image if the request fails. The photo URL is re-fetched every hour.
 */
export default function MemberPhoto(props: MemberPhotoProps){
  const { data: url, error, isLoading } = useGetMemberPhotoQuery(props.membershipNumber, {pollingInterval: 3600000})

  const imgStyle: React.CSSProperties = {
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