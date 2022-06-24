import { CancelOutlined, CheckCircle, CheckCircleOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Link, Stack, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { useForm } from 'react-hook-form'
import Error from "../common/Error";
import SubmitButton from "../common/SubmitButton";
import { useGetStatusQuery } from "../redux/applicationsApi";

export default function ApplicationStatus(){

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [query, setQuery] = useState()

  const { data: status, error, isLoading } = useGetStatusQuery(query, {skip: !query})

  const onSubmit = (data) => {
    setQuery(data)
  }

  const StatusBox = (props) => {
    let icon = <CancelOutlined color="disabled" fontSize="inherit" />
    let text = props.defaultText
    let background = {}

    if (props.status === "SUBMITTED"){
      icon = <CheckCircleOutlined color="disabled" fontSize="inherit" />
      text = props.submittedText
    }else if(props.status === "ACCEPTED"){
      icon = <CheckCircle color="success" fontSize="inherit" />
      text = props.acceptedText
      background = {backgroundColor: "#4caf5033"}
    }

    return <Grid item sm={4} xs={12}>
      <Stack sx={{aspectRatio: '1 / 1', border: '3px solid grey', borderRadius: '10px', padding: '1rem', ...background}}>
        <Typography variant="h1" sx={{textAlign: 'center', marginTop: '1rem'}} gutterBottom>{icon}</Typography>
        <Typography variant="body1" sx={{textAlign: 'center'}} gutterBottom><strong>{props.title}</strong></Typography>
        <Typography variant="body2" sx={{textAlign: 'center'}}>{text}</Typography>
      </Stack>
    </Grid>
  }

  if(status && query) {
    const submittedDate = moment.unix(status.submittedAt).format("YYYY-MM-DD")

    return <>
      <Typography variant="h4" gutterBottom>Application Status for {status.membershipNumber}</Typography>

      <Grid container spacing={2} sx={{marginTop: '1rem'}}>
        <StatusBox status={status.status.scouting} title="Scout Reference"
          defaultText="We have not yet received a reference from a Scout referee."
          submittedText="We have received a reference from your Scout referee, but it hasn't yet been reviewed by the Membership Coordinator."
          acceptedText="We have received and reviewed the reference from your Scout referree." />
        <StatusBox status={status.status.nonScouting} title="Non-Scout Reference"
          defaultText="We have not yet received a reference from a Non-Scout referee."
          submittedText="We have received a reference from your Non-Scout referee, but it hasn't yet been reviewed by the Membership Coordinator."
          acceptedText="We have received and reviewed the reference from your Non-Scout referree." />
        <StatusBox status={status.status.fiveYears} title="Five Years"
          defaultText="We have not yet received a reference from a referee who has known you for 5 or more years."
          submittedText="We have received a reference from a referee who has known you for 5 or more years, but it hasn't yet been reviewed by the Membership Coordinator."
          acceptedText="We have received and reviewed a reference from a referee who has known you for 5 or more years." />
      </Grid>
      
      <Typography variant="body1" sx={{marginTop: '2rem'}}>
        Your application was submitted on <time dateTime={submittedDate}>{submittedDate}</time>.
      </Typography>

      <Typography variant="body1" sx={{marginTop: '1rem'}}>
        The link your referees need in order to complete their references is: <Link href={`https://portal.qswp.org.uk/join/${status.membershipNumber}/reference`}>https://portal.qswp.org.uk/join/{status.membershipNumber}/reference</Link>.<br />
        You can also pass this link to alternative referees if your original referees are no longer able to help with the application process.
      </Typography>

      <Box sx={{marginTop: '2rem'}}>
        <Button variant="contained" onClick={() => {
          setQuery(null)
          reset()
        }}>Start Again</Button>
      </Box>
    </>
  }else{
    return <Box>
      <Typography variant="h4" gutterBottom>Check Application Status</Typography>
      <Typography variant="body1" gutterBottom>
          If you have previously applied to join the QSWP, you can check the status of your application by filling out the details below.
          If you have any questions regarding your application, please contact our <Link href="mailto:members@qswp.org.uk">Membership Coordinator</Link>.
      </Typography>

      {error ? <Error error={error}>An error occurred whilst checking the status of your application</Error> : null }

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{marginTop: '2rem'}}>
          <TextField variant="outlined" label="Scout Membership Number"
            error={errors.membershipNumber != null} helperText={errors.membershipNumber ? "This field is required and must be a number" : null}
            required fullWidth 
            {...register("membershipNumber", {required: true, pattern: /[1-9][0-9]+/})} />

          <TextField variant="outlined" label="Date of Birth"
            error={errors.dateOfBirth != null} helperText={errors.dateOfBirth ? "This field is required" : null}
            required fullWidth type="date"
            InputLabelProps={{ shrink: true }} 
            {...register("dateOfBirth", {required: true})} />
          
          <Box>
            <SubmitButton submitting={ isLoading } disabled={Object.keys(errors).length > 0} text="Submit" submittingText="Submitting..." />
          </Box>
        </Stack>
      </form>
    </Box>
  }
}