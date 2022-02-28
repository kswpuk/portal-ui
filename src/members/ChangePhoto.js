import { Button, Grid, Typography } from '@mui/material'
import { DropzoneArea } from 'material-ui-dropzone'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Error from '../common/Error'
import MemberPhoto from '../common/MemberPhoto'
import { useChangePhotoMutation } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'

export default function ChangePhoto(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const { membershipNumber: membershipNumberParams } = useParams()
  const membershipNumber = props.membershipNumber || membershipNumberParams

  const [photo, setPhoto] = useState(null)

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
    changePhoto({membershipNumber, photo: ""})
  }

  const onChangePhoto = () => {
    const reader = new FileReader();
    reader.onloadend = function() {
      changePhoto({membershipNumber, photo: reader.result})
    }
    reader.readAsDataURL(photo[0]);
  }

  return <>
    {error ? <Error error={error} gutterBottom /> : null}
    <Grid container spacing={3}>
      <Grid item sm={4}>
        <Typography variant='h5' gutterBottom>Current Photo</Typography>
        <MemberPhoto membershipNumber={membershipNumber}
          alt="Current Photo" />
        <Button disabled={isLoading} variant="outlined" sx={{mt: '1rem'}} onClick={onRemovePhoto}>Remove Current Photo</Button>
      </Grid>
      <Grid item sm={8}>
        <Typography variant='h5' gutterBottom>New Photo</Typography>
        <DropzoneArea
            acceptedFiles={['image/*']} maxFileSize={3000000} filesLimit={1}
            showPreviews={true} showPreviewsInDropzone={false} useChipsForPreview={true} previewText="Selected Image:"
            showAlerts={false}
            dropzoneText="Drag and drop a photo here or click (3 MB limit)"
            onChange={(file) => setPhoto(file)}
          />
          <Button disabled={isLoading} variant="contained" sx={{mt: '1rem'}} onClick={onChangePhoto}>Update Photo</Button>
      </Grid>
    </Grid>
  </>
}