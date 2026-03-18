import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material'

import { useGetMemberQuery, useUpdateMemberMutation } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import Loading from '../common/Loading'
import Error from '../common/Error'
import { SubmitHandler, useForm } from 'react-hook-form'
import SubmitButton from '../common/SubmitButton'
import { useAppDispatch } from '../redux/hooks'

interface EditMemberProps {
  membershipNumber?: string
}

type EditMemberFormValues = Omit<Member, "membershipNumber">

export default function EditMember(props: EditMemberProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const { membershipNumber: membershipNumberParams } = useParams()
  const membershipNumber = props.membershipNumber || membershipNumberParams || null

  if (membershipNumber === null) {
    return <Error>No membership number provided</Error>
  }

  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber)
  const [ updateMember, { isLoading: isUpdating, isSuccess: isUpdated, error: updateError } ] = useUpdateMemberMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<EditMemberFormValues>();

  const editMember: SubmitHandler<EditMemberFormValues> = (data) => {
    updateMember({ membershipNumber, ...data })
  }

  useEffect(() => {
    if(member) {
      dispatch(setTitle("Editing "+(member.preferredName || member.firstName) + " " + member.surname + " (" + membershipNumber + ")"))
    }else{
      dispatch(setTitle("Editing "+membershipNumber))
    }
  }, [dispatch, member, membershipNumber])

  useEffect(() => {
    if(isUpdated){
      navigate("/members/"+membershipNumber+"/view")
    }
  }, [navigate, isUpdated, membershipNumber])
  
  if(isLoading || member === undefined){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading details of member {membershipNumber}</Error>
  }

  return <>
    {updateError ? <Error error={updateError}>An error occurred whilst updating the details of member {membershipNumber}</Error> : null}
    <form onSubmit={handleSubmit(editMember)}>
      <Stack spacing={3}>
        <Box>
          <Typography variant='h5' gutterBottom>Personal Information</Typography>

          <Grid container spacing={3}>
            <Grid size={{sm: 6}}>
              <TextField variant="outlined" label="First Name" defaultValue={member.firstName}
                error={errors.firstName !== undefined} helperText={errors.firstName ? "This field is required" : null}
                required fullWidth 
                {...register("firstName", {required: true})} />
            </Grid>
            <Grid size={{sm: 6}}>
              <TextField variant="outlined" label="Surname" defaultValue={member.surname}
                error={errors.surname !== undefined} helperText={errors.surname ? "This field is required" : null}
                required fullWidth
                {...register("surname", {required: true})}/>
            </Grid>

            <Grid size={{sm: 6}}>
              <TextField variant="outlined" label="Preferred Name" defaultValue={member.preferredName}
                fullWidth
                {...register("preferredName")}/>
            </Grid>
            <Grid size={{sm: 6}}>
              <TextField variant="outlined" label="Date of Birth" value={member.dateOfBirth}
                disabled required fullWidth type="date" />
            </Grid>

            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="Medical Information" defaultValue={member.medicalInformation}
                helperText="Please provide any information you feel it is important for us or event organisers to know. This information will be treated in confidence."
                multiline minRows={2} fullWidth
                {...register("medicalInformation")} />
            </Grid>

            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="Dietary Requirements" defaultValue={member.dietaryRequirements}
                multiline minRows={2} fullWidth
                {...register("dietaryRequirements")} />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant='h5' gutterBottom>Contact Information</Typography>
          <Grid container spacing={3}>
            
            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="E-mail Address" defaultValue={member.email}
                error={errors.email !== undefined} helperText={errors.email ? "A valid e-mail address is required" : null}
                type="email" required fullWidth
                {...register("email", {required: true, pattern: /^\S+@\S+$/i})} />
            </Grid>

            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="Telephone Number" defaultValue={member.telephone}
                error={errors.telephone !== undefined} helperText={errors.telephone ?  "A valid phone number is required" : "Your mobile number is preferred, as we may use it to contact you during an event."}
                type="tel" required fullWidth
                {...register("telephone", {required: true, pattern: /^[ +0-9]{11,14}$/})} />
            </Grid>

            <Grid size={{sm: 8}}>
              <TextField variant="outlined" label="Address" defaultValue={member.address}
                error={errors.address !== undefined} helperText={errors.address ? "This field is required" : null}
                required multiline minRows={3} fullWidth
                {...register("address", {required: true})}/>
            </Grid>
            <Grid size={{sm: 4}}>
              <TextField variant="outlined" label="Postcode" defaultValue={member.postcode}
                error={errors.postcode !== undefined} helperText={errors.postcode ? "A valid postcode is required" : null}
                required fullWidth {...register("postcode", {required: true, pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i})}/>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography variant='h5' gutterBottom>Emergency Contact</Typography>
          <Grid container spacing={3}>
            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="Emergency Contact Name" defaultValue={member.emergencyContactName}
                error={errors.emergencyContactName !== undefined} helperText={errors.emergencyContactName ? "This field is required" : null}
                required fullWidth
                {...register("emergencyContactName", {required: true})} />
            </Grid>
            <Grid size={{sm: 12}}>
              <TextField variant="outlined" label="Emergency Contact Telephone Number" defaultValue={member.emergencyContactTelephone}
                error={errors.emergencyContactTelephone !== undefined} helperText={errors.emergencyContactTelephone ? "A valid telephone number is required" : null}
                type="tel" required fullWidth
                {...register("emergencyContactTelephone", {required: true, pattern: /^[ +0-9]{11,14}$/})} />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <SubmitButton submitting={isUpdating} text="Update" submittingText="Updating..." />
          <Button sx={{ml: 2}} variant="outlined" href={"/members/"+membershipNumber+"/view"}>Cancel</Button>
        </Box>
      </Stack>
    </form>
  </>
}