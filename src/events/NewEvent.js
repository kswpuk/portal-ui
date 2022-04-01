import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/navSlice'

import { useEffect, useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material'
import { useCreateEventMutation, useListEventSeriesQuery } from '../redux/eventsApi'
import Loading from '../common/Loading'
import Error from '../common/Error'
import SelectEventSeries from './SelectEventSeriesWidget'
import { useForm } from 'react-hook-form'
import { Box } from '@mui/system'
import SubmitButton from '../common/SubmitButton'
import { useNavigate } from 'react-router-dom'

export default function NewEvent() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { register, watch, handleSubmit, formState: { errors } } = useForm();

  const startDateWatch = watch("startDate")

  const [eventSeriesId, setEventSeriesId] = useState(null)
  const [eventId, setEventId] = useState(null)
  const [locationType, setLocationType] = useState("physical")  
  const [salt, setSalt] = useState("qsa")

  const { data: series, isLoading: seriesLoading, error: seriesError, refetch: seriesRefetch } = useListEventSeriesQuery()
  const [ submitEvent, { isLoading: isSubmitting, isSuccess: isSubmitted, error: submitError } ] = useCreateEventMutation()

  useEffect(() => {
    dispatch(setTitle("New Event"))
  }, [dispatch])

  useEffect(() => {
    const base = [..."abcdefghijklmnopqrstuvwxyz"];

    setSalt([...Array(3)]
      .map(i => base[Math.random()*base.length|0])
      .join(''))
  }, [setSalt])

  useEffect(() => {
    if(isSubmitted){
      navigate(`/events/${eventSeriesId}/${eventId}`)
    }
  }, [navigate, isSubmitted, eventSeriesId, eventId])

  useEffect(() => {
    setEventId(startDateWatch?.substring(0, 10) + "-" + salt);
  }, [setEventId, startDateWatch, salt])

  const handleLocationTypeChange = (event) => {
    setLocationType(event.target.value);
  };

  const onSubmit = (data) => {
    submitEvent({ eventSeriesId, eventId, body: {
      ...data,
      locationType,
      attendanceCriteria: Object.values(data["attendanceCriteria"]).filter(v => v)
    } })
  }

  //TODO: Create new event series

  let seriesEl = null
  if(seriesLoading){
    seriesEl = <Loading />
  }else if(seriesError){
    seriesEl = <Error error={seriesError} onRetry={seriesRefetch}/>
  }else if(series){
    seriesEl = <>
      <SelectEventSeries series={series} onChange={setEventSeriesId} />
    </>
  }

  const locationEl = <TextField variant="outlined" label="Location"
    error={errors.location != null} helperText={errors.location ? "This field is required" : null}
    required fullWidth
    {...register("location", {required: true})} />
  
  const postcodeEl = <TextField variant="outlined" label="Postcode"
    error={errors.postcode != null} helperText={errors.postcode ? "This field is required" : null}
    required fullWidth
    {...register("postcode", {
      validate: {
        required: () => locationType === "physical",
      }})} />

  return <>
    <Typography variant='h5' gutterBottom>Event Series</Typography>

    {seriesEl}

    <Typography variant='h5' gutterBottom>Event</Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{marginBottom: '1rem'}}>
        {submitError ? <Error error={submitError}>An error occurred whilst submitting your application form.</Error> : null}

        <TextField variant="outlined" label="Details"
          error={errors.details != null} helperText={errors.details ? "This field is required" : "Provide event specific details, such as what we'll be doing, and accommodation and food arrangements."}
          required multiline minRows={3} fullWidth
          {...register("details", {required: true})}/>
        
        <TextField variant="outlined" label="Registration Deadline"
          error={errors.registrationDate != null} helperText={errors.registrationDate ? "This field is required" : null}
          required fullWidth type="date"
          InputLabelProps={{ shrink: true }} 
          {...register("registrationDate", {required: true})} />
        
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField variant="outlined" label="Start Date"
                error={errors.startDate != null} helperText={errors.startDate ? "This field is required" : null}
                required fullWidth type="datetime-local"
                InputLabelProps={{ shrink: true }} 
                {...register("startDate", {required: true})} />
            </Grid>
            <Grid item xs={6}>
              <TextField variant="outlined" label="End Date"
                error={errors.endDate != null} helperText={errors.startDate ? "This field is required" : null}
                required fullWidth type="datetime-local"
                InputLabelProps={{ shrink: true }} 
                {...register("endDate", {required: true})} />
            </Grid>
          </Grid>
        </Box>

        <Typography variant='h6' gutterBottom>Location</Typography>

        <FormControl fullWidth>
          <InputLabel id="selectLocationType-label">Location Type</InputLabel>
          <Select
            required
            labelId="selectLocationType-label" label="Location Type"
            value={locationType} onChange={handleLocationTypeChange}>
              <MenuItem value="physical">Physical</MenuItem>
              <MenuItem value="virtual">Virtual</MenuItem>
          </Select>
        </FormControl>

        {locationType === "virtual" ? locationEl : <Box sx={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={9}>{locationEl}</Grid>
            <Grid item xs={3}>{postcodeEl}</Grid>
          </Grid>
        </Box>}

        <Typography variant='h6' gutterBottom>Attendance</Typography>

        <Grid container>
          <Grid item xs={6}>
            <FormControlLabel control={<Checkbox defaultChecked={true} value="active" {...register("attendanceCriteria.active")} />} label="Active Members" />
          </Grid>

          <Grid item xs={6}>
            <RadioGroup defaultValue="">
              <FormControlLabel control={<Radio value="" {...register("attendanceCriteria.age")} />} label="No age limit" />
              <FormControlLabel control={<Radio value="over25" {...register("attendanceCriteria.age")} />} label="25 and over" />
              <FormControlLabel control={<Radio value="under25" {...register("attendanceCriteria.age")} />} label="Under 25" />
            </RadioGroup>
          </Grid>
        </Grid>

        <TextField variant="outlined" label="Attendance Limit"
          error={errors.attendanceLimit != null} helperText={errors.attendanceLimit ? "This field is required" : "Use 0 to indicate there is no limit on attendance for this event"}
          required fullWidth
          defaultValue="0"
          InputLabelProps={{ inputMode: "numeric", pattern: "[0-9]+" }} 
          {...register("attendanceLimit", {required: true, min: 0, pattern: "[0-9]+"})} />

      </Stack>

      <SubmitButton disabled={!eventSeriesId} submitting={isSubmitting}>Create Event</SubmitButton>
    </form>
  </>
}