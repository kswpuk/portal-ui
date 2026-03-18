import { Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Error from '../common/Error'
import MemberPhoto from '../common/MemberPhoto'
import { useChangePhotoMutation } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import ImageDropzone from '../common/ImageDropzone'
import { useAppDispatch } from '../redux/hooks'

interface ChangePhotoProps {
  /**
   * Membership number of the member whose photo is being changed.
   * Uses the membership number from the URL if not provided.
   */
  membershipNumber?: string
}

export default function ChangePhoto(props: ChangePhotoProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  
  const { membershipNumber: membershipNumberParams } = useParams()
  const membershipNumber = props.membershipNumber || membershipNumberParams

  const [photo, setPhoto] = useState<File[]>([])

  const [ changePhoto, { isLoading, isSuccess, error } ] = useChangePhotoMutation()

  useEffect(() => {
    dispatch(setTitle("Updating photo for "+membershipNumber))
  }, [dispatch, membershipNumber])

  useEffect(() => {
    if(isSuccess){
      navigate("/members/"+membershipNumber+"/view")
    }
  }, [navigate, isSuccess, membershipNumber])

  const onRemovePhoto = () => {
    if (membershipNumber)
      changePhoto({membershipNumber, photo: ""})
  }

  const onChangePhoto = () => {
    const reader = new FileReader();
    reader.onloadend = function() {
      if (membershipNumber)
        changePhoto({membershipNumber, photo: reader.result})
    }
    reader.readAsDataURL(photo[0]);
  }

  return <>
    {error ? <Error error={error} gutterBottom /> : null}
    <Grid container spacing={3}>
      <Grid size={{sm: 4}}>
        <Typography variant='h5' gutterBottom>Current Photo</Typography>
        <MemberPhoto membershipNumber={membershipNumber || ""}
          alt="Current Photo" />
        <Button disabled={isLoading} variant="outlined" sx={{mt: '1rem'}} onClick={onRemovePhoto}>Remove Current Photo</Button>
      </Grid>
      <Grid size={{sm: 8}}>
        <Typography variant='h5' gutterBottom>New Photo</Typography>
          <ImageDropzone onFileSelected={(file) => setPhoto([file])} />
          <Button disabled={isLoading || photo.length === 0} variant="contained" sx={{mt: '1rem'}} onClick={onChangePhoto}>Update Photo</Button>
      </Grid>
    </Grid>
  </>
}