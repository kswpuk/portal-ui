import { Box, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useListEventSeriesQuery } from "../redux/eventsApi";
import Loading from '../common/Loading'
import Error from '../common/Error'
import SubmitButton from '../common/SubmitButton'
import SelectEventSeriesWidget from './SelectEventSeriesWidget'

export default function EventForm(props){

  const { register, watch, handleSubmit, formState: { errors } } = useForm();

  const startDateWatch = watch("startDate")

  const [eventSeriesId, setEventSeriesId] = useState(props.eventSeriesId)
  const [eventId, setEventId] = useState(props.eventId)
  const [locationType, setLocationType] = useState(props.event?.locationType || "physical")  
  const [salt, setSalt] = useState("qsa")

  const { data: series, isLoading: seriesLoading, error: seriesError, refetch: seriesRefetch } = useListEventSeriesQuery()

  useEffect(() => {
    const base = [..."abcdefghijklmnopqrstuvwxyz"];

    setSalt([...Array(3)]
      .map(i => base[Math.random()*base.length|0])
      .join(''))
  }, [setSalt])


  useEffect(() => {
    setEventId(startDateWatch?.substring(0, 10) + "-" + salt);
  }, [setEventId, startDateWatch, salt])

  const handleLocationTypeChange = (event) => {
    setLocationType(event.target.value);
  };

  const onSubmit = (data) => {
    props.onSubmit({ eventSeriesId: (props.eventSeriesId || eventSeriesId), eventId: (props.eventId || eventId),
      body: {
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
      <SelectEventSeriesWidget selected={props.eventSeriesId} series={series} onChange={props.eventSeriesId ? null : setEventSeriesId} />
    </>
  }

  const locationEl = <TextField variant="outlined" label="Location" defaultValue={props.event?.location}
    error={errors.location != null} helperText={errors.location ? "This field is required" : null}
    required fullWidth
    {...register("location", {required: true})} />
  
  const postcodeEl = <TextField variant="outlined" label="Postcode" defaultValue={props.event?.postcode}
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
        {props.error ? <Error error={props.error}>An error occurred whilst submitting your application form.</Error> : null}

        <TextField variant="outlined" label="Details"
          defaultValue={props.event?.details}
          error={errors.details != null} helperText={errors.details ? "This field is required" : "Provide event specific details, such as what we'll be doing, and accommodation and food arrangements."}
          required multiline minRows={3} fullWidth
          {...register("details", {required: true})}/>
        
        <TextField variant="outlined" label="Registration Deadline"
          defaultValue={props.event?.registrationDate}
          error={errors.registrationDate != null} helperText={errors.registrationDate ? "This field is required" : null}
          required fullWidth type="date"
          InputLabelProps={{ shrink: true }} 
          {...register("registrationDate", {required: true})} />
        
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField variant="outlined" label="Start Date"
                defaultValue={props.event?.startDate}
                error={errors.startDate != null} helperText={errors.startDate ? "This field is required" : null}
                required fullWidth type="datetime-local"
                InputLabelProps={{ shrink: true }} 
                {...register("startDate", {required: true})} />
            </Grid>
            <Grid item xs={6}>
              <TextField variant="outlined" label="End Date"
                defaultValue={props.event?.endDate}
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
            <FormControlLabel control={<Checkbox defaultChecked={props.event?.attendanceCriteria.includes("active") || true} value="active" {...register("attendanceCriteria.active")} />} label="Active Members" />
          </Grid>

          <Grid item xs={6}>
            <RadioGroup defaultValue={props.event?.attendanceCriteria.includes("over25") ? "over25" : (props.event?.attendanceCriteria.includes("under25") ? "under25" : "")}>
              <FormControlLabel control={<Radio value="" {...register("attendanceCriteria.age")} />} label="No age limit" />
              <FormControlLabel control={<Radio value="over25" {...register("attendanceCriteria.age")} />} label="25 and over" />
              <FormControlLabel control={<Radio value="under25" {...register("attendanceCriteria.age")} />} label="Under 25" />
            </RadioGroup>
          </Grid>
        </Grid>

        <TextField variant="outlined" label="Attendance Limit"
          defaultValue={props.event?.attendanceLimit || 0}
          error={errors.attendanceLimit != null} helperText={errors.attendanceLimit ? "This field is required" : "Use 0 to indicate there is no limit on attendance for this event"}
          required fullWidth
          InputLabelProps={{ inputMode: "numeric", pattern: "[0-9]+" }} 
          {...register("attendanceLimit", {required: true, min: 0, pattern: "[0-9]+"})} />

      </Stack>

      <SubmitButton disabled={!eventSeriesId} submitting={props.submitting}>{props.event ? "Update" : "Create"} Event</SubmitButton>
    </form>
  </>
}