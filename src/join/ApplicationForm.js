import { Box, Checkbox, FormGroup, FormControlLabel, Grid, Link, Stack, TextField, Typography } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useState } from "react";
import { useForm } from 'react-hook-form'
import Error from "../common/Error";
import SubmitButton from "../common/SubmitButton";
import { useSubmitApplicationMutation } from "../redux/applicationsApi";
import Submitted from "./Submitted";

export default function ApplicationForm(){

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ submitApplication, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useSubmitApplicationMutation()

  const [declarationChecked, setDeclarationChecked] = useState(false)
  const [encoding, setEncoding] = useState(false)
  const [evidence, setEvidence] = useState(null)

  const onSubmit = (data) => {
    setEncoding(true)
    const reader = new FileReader();
    reader.onloadend = function() {
      submitApplication({...data, evidence: reader.result})
      setEncoding(false)
    }
    reader.readAsDataURL(evidence[0]);
  }

  const toggleDeclaration = () => {
    setDeclarationChecked(!declarationChecked)
  }

  if(isSubmitted){
    return <Submitted />
  }

  return <Box>
    <Typography variant="h4" gutterBottom>Join the QSWP</Typography>
    <Typography variant="body1" gutterBottom>
        The Queen's Scout Working Party is a national Scout Active Support Unit that supports national Scouting events and promotes the top awards.
        As a Queen's Scout Award holder, you are applicable to join the QSWP by completing the form below.
        It may take a number of weeks to process your application, and we will not be able to accept your application until we have received references from the two referees you provide below.
    </Typography>
    <Typography variant="body1" gutterBottom>
        If you have any questions about joining the QSWP, please contact our <Link href="mailto:members@qswp.org.uk">Membership Coordinator</Link>.
    </Typography>

    {submitError ? <Error error={submitError}>An error occurred whilst submitting your application form.</Error> : null}

    <form onSubmit={handleSubmit(onSubmit)}>

    <Stack spacing={3}>
      <Box>
        <Typography variant='h5' gutterBottom>All About You</Typography>

        <Stack spacing={3}>
          <TextField variant="outlined" label="Scout Membership Number"
            error={errors.membershipNumber != null} helperText={errors.membershipNumber ? "This field is required and must be a number" : null}
            required fullWidth 
            {...register("membershipNumber", {required: true, pattern: /[1-9][0-9]+/})} />

          <TextField variant="outlined" label="First Name"
            error={errors.firstName != null} helperText={errors.firstName ? "This field is required" : null}
            required fullWidth 
            {...register("firstName", {required: true})} />

          <TextField variant="outlined" label="Surname"
            error={errors.surname != null} helperText={errors.surname ? "This field is required" : null}
            required fullWidth
            {...register("surname", {required: true})}/>

          <TextField variant="outlined" label="Date of Birth"
              error={errors.dateOfBirth != null} helperText={errors.dateOfBirth ? "This field is required" : null}
              required fullWidth type="date"
              InputLabelProps={{ shrink: true }} 
            {...register("dateOfBirth")} />
        </Stack>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>Your Contact Details</Typography>

        <Stack spacing={3}>
          <TextField variant="outlined" label="E-mail Address"
            error={errors.email != null} helperText={errors.email ? "A valid e-mail address is required" : null}
            type="email" required fullWidth
            {...register("email", {required: true, pattern: /^\S+@\S+$/i})} />

          <TextField variant="outlined" label="Telephone Number"
            error={errors.telephone != null} helperText={errors.telephone ?  "A valid phone number is required" : "Your mobile number is preferred."}
            type="tel" required fullWidth
            {...register("telephone", {required: true, pattern: /^[ +0-9]{11,14}$/})} />

          <Grid container>
            <Grid item sm={8}>
              <TextField variant="outlined" label="Address"
                error={errors.address != null} helperText={errors.address ? "This field is required" : null}
                required multiline minRows={3} fullWidth
                {...register("address", {required: true})}/>
            </Grid>
            <Grid item sm={4} sx={{pl: '1rem'}}>
              <TextField variant="outlined" label="Postcode"
                error={errors.postcode != null} helperText={errors.postcode ? "A valid postcode is required" : null}
                required fullWidth {...register("postcode", {required: true, pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i})}/>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>Your Queen's Scout Award</Typography>

        <Stack spacing={3}>
          <Typography variant="body2" gutterBottom>
            Please provide some evidence that you have received your Queen's Scout Award. This could be, for example, a scan of your Queen's Scout Award certificate or a photo of you receiving your award.
          </Typography>

          <TextField variant="outlined" label="Month you received your Queen's Scout Award"
                error={errors.qsaReceived != null} helperText={errors.qsaReceived ? "This field is required (YYYY-MM)" : null}
                required fullWidth type="month"
                InputLabelProps={{ shrink: true }} 
              {...register("qsaReceived")} />

          <DropzoneArea
            acceptedFiles={['image/*']} maxFileSize={3000000} filesLimit={1}
            showPreviews={true} showPreviewsInDropzone={false} useChipsForPreview={true} previewText="Selected Image:"
            showAlerts={false}
            dropzoneText="Drag and drop an image here or click (3 MB limit)"
            onChange={(file) => setEvidence(file)}
          />
        </Stack>
        
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>References</Typography>
        <Typography variant="body2" gutterBottom>
          Neither of your referees should be related to you, and at least one of your referees <strong>must have known you for at least 5 years</strong>.
          We aren't able to accept your application until we have received both a Scout and a non-Scout reference, so please ensure that they respond promptly.
        </Typography>

        <Stack spacing={2}>
        <Box>
          <Typography variant='h6'>Scout Reference</Typography>
          <Typography variant="body2" gutterBottom>
            Your Scout reference should be someone that knows you through Scouting, and is ideally part of your line management chain (e.g. District Commissioner).
          </Typography>

          <Stack spacing={3}>
            <TextField variant="outlined" label="Referee's Name"
              error={errors.srName != null} helperText={errors.srName ? "This field is required" : null}
              required fullWidth 
              {...register("srName", {required: true})} />

            <TextField variant="outlined" label="Referee's E-mail Address"
              error={errors.srEmail != null} helperText={errors.srEmail ? "A valid e-mail address is required" : null}
              type="email" required fullWidth
              {...register("srEmail", {required: true, pattern: /^\S+@\S+$/i})} />
          </Stack>
        </Box>

        <Box>
          <Typography variant='h6'>Non-Scout Reference</Typography>
          <Typography variant="body2" gutterBottom>
            Your non-Scout reference should be someone that knows you outside of Scouting, ideally in a work or professional setting (e.g. employer, university tutor).
          </Typography>

          <Stack spacing={3}>
            <TextField variant="outlined" label="Referee's Name"
              error={errors.nsrName != null} helperText={errors.nsrName ? "This field is required" : null}
              required fullWidth 
              {...register("nsrName", {required: true})} />

            <TextField variant="outlined" label="Referee's E-mail Address"
              error={errors.nsrEmail != null} helperText={errors.nsrEmail ? "A valid e-mail address is required" : null}
              type="email" required fullWidth
              {...register("nsrEmail", {required: true, pattern: /^\S+@\S+$/i})} />
          </Stack>
        </Box>
        </Stack>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>Declaration</Typography>
        <Typography variant="body2" gutterBottom>
          By submitting this form, you confirm that you are a Queen's Scout Award holder and that you either hold or would be willing to obtain a DBS check through The Scout Association.
          You also confirm that all the information you have provided is correct and complete.
        </Typography>
        <Typography variant="body2" gutterBottom>
          By submitting this form, you consent to the QSWP holding the information you have provided for the purposes of assessing your application, and for us to contact The Scout Association and your references regarding your application.
          For more information, please refer to our <Link href="http://www.qswp.org.uk/members/dataPolicy.html" target="_blank" rel="noreferrer">Data Policy</Link>.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Upon joining the QSWP, you will be expected to pay an annual &pound;5.00 membership fee - details will be sent out once your application is successful.
          This must be paid within 3 months of your application being accepted, else your membership may be revoked and you will need to apply again.
        </Typography>
        <Typography variant="body2" gutterBottom>
          We expect members of the QSWP to support at least two events per year.
          If you are concerned about meeting this commitment, please contact our <Link href="mailto:events@qswp.org.uk">Events Coordinator</Link> to discuss prior to submitting your application.
        </Typography>

        <FormGroup>
          <FormControlLabel control={<Checkbox checked={declarationChecked} onClick={() => toggleDeclaration()} />} label="I agree to the above declaration" />
        </FormGroup>
      </Box>

      <Box>
        <SubmitButton submitting={isSubmitting || encoding} disabled={!declarationChecked || Object.keys(errors).length > 0 || evidence === null} text="Submit" submittingText="Submitting..." />
      </Box>
    </Stack>
    </form>
  </Box>
}