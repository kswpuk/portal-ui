import { Box, FormControl, Grid, InputLabel, Link, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import Error from "../common/Error"
import Loading from "../common/Loading"
import SubmitButton from "../common/SubmitButton"
import { useGetApplicationHeadQuery, useSubmitReferenceMutation } from "../redux/applicationsApi"
import ReferenceRating from "./ReferenceRating"

export default function ReferenceForm(props) {
  const { membershipNumber } = useParams()
  const { data: applicant, error, isLoading } = useGetApplicationHeadQuery(membershipNumber)

  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const [ submitReference, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useSubmitReferenceMutation()

  const onSubmit = (data) => {
    submitReference({ membershipNumber, reference: data })
  }

  if(isSubmitted){
    return <>
      <Typography variant="h4" gutterBottom>Reference for {applicant.firstName} {applicant.surname}</Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for providing a reference for {applicant.firstName} {applicant.surname}. Your input into the application process is appreciated.
        If we have any queries regarding your application, we will be in touch.
      </Typography>
      <Typography variant="body1" gutterBottom>
        If you have any questions regarding this reference, please contact our <Link href="mailto:members@kswp.org.uk">Membership Coordinator</Link>.
        For information on what information we collect and how it is used, please refer to our <Link href="http://www.kswp.org.uk/members/dataPolicy.html">Data Policy</Link>.
      </Typography>
    </>
  }else if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error}>We were unable to retrieve details for this applicant.</Error>
  }

  if(Object.keys(applicant).length === 0){
    return <Error>We can't find the details for this applicant. Their application may already have been approved.</Error>
  }

  return <Box>
    <Typography variant="h4" gutterBottom>Reference for {applicant.firstName} {applicant.surname}</Typography>
    <Typography variant="body1" gutterBottom>
      The King's Scout Working Party is a national Scout Active Support Unit that supports national Scouting events and promotes the top awards.
      You have been nominated as a referee for {applicant.firstName} {applicant.surname}, who has applied to join the KSWP, and we ask that you spend a few minutes to complete the following reference form so we can progress their application.
      We appreciate your input into the application process, and thank you for your time completing this form.
    </Typography>
    <Typography variant="body1" gutterBottom>
      If you have any questions regarding this reference, please contact our <Link href="mailto:members@kswp.org.uk">Membership Coordinator</Link>.
      For information on what information we collect and how it is used, please refer to our <Link href="http://www.kswp.org.uk/members/dataPolicy.html">Data Policy</Link>.
    </Typography>

    { submitError? <Error error={submitError}>An error occurred whilst processing your reference.</Error> : null }

    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{mt: '1rem'}}>
        <Box>
          <Typography variant='h5' gutterBottom>Your Details</Typography>

          <Stack spacing={3}>
            <TextField variant="outlined" label="Name"
              error={errors.name != null} helperText={errors.name ? "This field is required" : null}
              required fullWidth 
              {...register("name", {required: true})} />

            <TextField variant="outlined" label="E-mail"
              error={errors.email != null} helperText={errors.email ? "This field is required" : null}
              required fullWidth type="email"
              {...register("email", {required: true, pattern: /^\S+@\S+$/i})} />
          </Stack>
        </Box>

        <Box>
          <Typography variant='h5' gutterBottom>Your Relation to {applicant.firstName} {applicant.surname}</Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="relationship-label">How do you know the applicant?</InputLabel>
              <Select
                labelId="relationship-label"
                label="How do you know the applicant?"
                defaultValue="scouting"
                {...register("relationship", {required: true})}
              >
                <MenuItem value="scouting">Through Scouting</MenuItem>
                <MenuItem value="nonScouting">Outside of Scouting</MenuItem>
              </Select>
            </FormControl>
            
            <TextField variant="outlined" label="In what capacity do you know the applicant?"
                error={errors.capacityKnown != null} helperText={"For example, as a District Commissioner or Employer." + (errors.capacityKnown ? " This field is required." : "")}
                required fullWidth type="capacityKnown"
                {...register("capacityKnown", {required: true})} />

            <FormControl fullWidth>
              <InputLabel id="howLong-label">How long have you known the applicant?</InputLabel>
              <Select
                labelId="howLong-label"
                label="How long have you known the applicant?"
                defaultValue="lessThan5"
                {...register("howLong", {required: true})}
              >
                <MenuItem value="lessThan5">Less than 5 years</MenuItem>
                <MenuItem value="moreThan5">5 or more years</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Box>
          <Typography variant='h5' gutterBottom>Your Reference</Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="notConsidered-label">Do you know of any reason that the applicant should NOT be considered for this role?</InputLabel>
              <Select
                labelId="notConsidered-label"
                label="Do you know of any reason that the applicant should NOT be considered for this role?"
                defaultValue="no"
                {...register("notConsidered", {required: true})}
              >
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="yes">Yes, I know a reason why this applicant should NOT be considered</MenuItem>
              </Select>
            </FormControl>

            <TextField variant="outlined" label="Statement of Support"
              helperText={"Please provide a brief statement describing why you believe they are suitable for this role." + (errors.statementOfSupport ? " This field is required." : "")}
              multiline minRows={3} fullWidth required
              {...register("statementOfSupport", {required: true})} />

            <Grid container>
              <ReferenceRating name="maturity" control={control} error={errors.maturity != null} />
              <ReferenceRating name="responsibility" control={control} error={errors.responsibility != null} />
              <ReferenceRating name="selfMotivation" quality="self-motivation" control={control} error={errors.selfMotivation != null} />
              <ReferenceRating name="motivateOthers" quality="ability to motivate others" control={control} error={errors.motivateOthers != null} />
              <ReferenceRating name="commitment" control={control} error={errors.commitment != null} />
              <ReferenceRating name="trustworthiness" control={control} error={errors.trustworthiness != null} />
              <ReferenceRating name="workWithAdults" quality="ability to work with adults" control={control} error={errors.workWithAdults != null} />
              <ReferenceRating name="respectForOthers" quality="respect for others" control={control} error={errors.respectForOthers != null} />
            </Grid>
            
          </Stack>
        </Box>
        
        <Box>
          <SubmitButton submitting={isSubmitting} disabled={Object.keys(errors).length > 0} text="Submit" submittingText="Submitting..." />
        </Box>
      </Stack>
    </form>
  </Box>
}