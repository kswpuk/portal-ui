import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useListEventSeriesQuery } from "../redux/eventsApi";
import Loading from '../common/Loading'
import Error from '../common/Error'
import SubmitButton from '../common/SubmitButton'
import SelectEventSeriesWidget from './SelectEventSeriesWidget'
import Privileged from "../common/Privileged";

export default function EventForm(props){

  const { register, watch, handleSubmit, formState: { errors } } = useForm();

  const startDateWatch = watch("startDate")
  const costWatch = watch("cost")
  const allocationOnPaymentWatch = watch("allocationOnPayment")

  const [eventSeriesId, setEventSeriesId] = useState(props.eventSeriesId)
  const [eventId, setEventId] = useState(props.eventId)
  const [payee, setPayee] = useState(props.event?.payee || "_qswp")
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

  const handlePayeeChange = (event) => {
    setPayee(event.target.value);
  };

  const handleLocationTypeChange = (event) => {
    setLocationType(event.target.value);
  };

  const onSubmit = (data) => {
    console.log(data)
    props.onSubmit({ eventSeriesId: (props.eventSeriesId || eventSeriesId), eventId: (props.eventId || eventId),
      body: {
        ...data,
        locationType,
        payee,
        attendanceCriteria: Object.values(data["attendanceCriteria"]).filter(v => v)
      } })
  }

  let seriesEl = null
  if(seriesLoading){
    seriesEl = <Loading />
  }else if(seriesError){
    seriesEl = <Error error={seriesError} onRetry={seriesRefetch}/>
  }else if(series){
    seriesEl = <>
      <SelectEventSeriesWidget selected={props.eventSeriesId} series={props.social ? series.filter(s => s.type === "social") : series} onChange={props.eventSeriesId ? null : setEventSeriesId} />
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

  const weightingSlider = (id, title, defaultValue = 0) => <>
    <Grid item xs={3}>
      {title}
    </Grid>
    <Grid item xs={9}>
      <Slider
        marks={true} track={false}
        valueLabelDisplay="auto"
        min={-3} max={3}
        defaultValue={props.event?.weightingCriteria?.[id] || defaultValue}
        {...register("weightingCriteria." + id)}
      />
    </Grid>
  </>

  return <>
    <Typography variant='h5' gutterBottom>Event Series</Typography>

    {seriesEl}

    <Typography variant='h5' gutterBottom>Event</Typography>

    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{marginBottom: '1rem'}}>
        {props.error ? <Error error={props.error}>An error occurred whilst {props.event ? "updating" : "creating"} your event.</Error> : null}

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

        <TextField variant="outlined" label="Event URL"
          defaultValue={props.event?.eventUrl}
          error={errors.eventUrl != null} helperText={errors.eventUrl ? "This field must be a valid URL" : null}
          fullWidth placeholder="http://www.example.com"
          InputLabelProps={{ shrink: true }} 
          {...register("eventUrl", {pattern: /https?:\/\/([-\w-])+\.{1}([a-zA-Z]{2,63})([/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/g})} />
        
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField variant="outlined" label="Cost"
                defaultValue={props.event?.cost || "0.00"}
                error={errors.cost != null} helperText={errors.cost ? "A valid number is required" : null}
                required fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">&pound;</InputAdornment>
                }}
                InputLabelProps={{ shrink: true }} 
                {...register("cost", {required: true, pattern: /(0|[1-9][0-9]*)(\.[0-9]{2})?/})} />
            </Grid>
            <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel id="selectPayee-label">Payable to</InputLabel>
              <Select
                required disabled={costWatch === "" || parseFloat(costWatch) === 0}
                labelId="selectPayee-label" label="Payable to"
                value={payee} onChange={handlePayeeChange}>
                  <MenuItem value="_organiser">Event Organiser</MenuItem>
                  <MenuItem value="_qswp">KSWP</MenuItem>
              </Select>
            </FormControl>
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
            <FormControlLabel control={<Checkbox defaultChecked={props.event?.attendanceCriteria ? props.event.attendanceCriteria.includes("active") : true} value="active" {...register("attendanceCriteria.active")} />} label="Active Members" />
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
        
        <Privileged allowed={["EVENTS"]}>
          <Box>
            <Typography variant='h6' gutterBottom>Allocation Rules</Typography>
            <Typography variant='body2'>
              Allocation rules are used to calculate suggested allocations for an event, and only apply if there is an attendance limit <em>and</em> the number of people registered for the event exceeds the attendance limit.
              The number assigned to each rule indicates the number of times a name is added or removed from the hat where a member meets the criteria for that rule.
              If there are no rules set (i.e. they are all 0), then allocation suggestions will be random.
            </Typography>
          </Box>

          <FormControlLabel control={<Checkbox defaultChecked={props.event?.allocationOnPayment} {...register("allocationOnPayment")} />} label="Allocation will be done manually on receipt of payment (first come, first served)" />

          <Accordion disabled={allocationOnPaymentWatch}>
            <AccordionSummary>
              Allocation Rules
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item xs={12} sx={{marginBottom: '0.5rem'}}>
                  <strong>Age</strong>
                </Grid>
                {weightingSlider("under_25", "Under 25", 1)}
                {weightingSlider("over_25", "Over 25")}

                <Grid item xs={12} sx={{marginBottom: '0.5rem'}}>
                  <strong>Joined KSWP</strong>
                </Grid>
                {weightingSlider("joined_1yr", "Past year", 1)}
                {weightingSlider("joined_2yr", "Past 2 years")}
                {weightingSlider("joined_3yr", "Past 3 years")}
                {weightingSlider("joined_5yr", "Past 5 years")}

                <Grid item xs={12} sx={{marginBottom: '0.5rem'}}>
                  <strong>Event Series Attendance</strong>
                </Grid>
                {weightingSlider("attended", "Previously")}
                {weightingSlider("attended_1yr", "Past year")}
                {weightingSlider("attended_2yr", "Past 2 years")}
                {weightingSlider("attended_3yr", "Past 3 years")}
                {weightingSlider("attended_5yr", "Past 5 years")}

                <Grid item xs={12} sx={{marginBottom: '0.5rem'}}>
                  <strong>Dropped Out of Events</strong>
                </Grid>
                {weightingSlider("droppedout_6mo", "Past 6 months")}
                {weightingSlider("droppedout_1yr", "Past year", -1)}
                {weightingSlider("droppedout_2yr", "Past 2 years")}
                {weightingSlider("droppedout_3yr", "Past 3 years")}

                <Grid item xs={12} sx={{marginBottom: '0.5rem'}}>
                  <strong>No Show at Events</strong>
                </Grid>
                {weightingSlider("noshow_6mo", "Past 6 months")}
                {weightingSlider("noshow_1yr", "Past year", -2)}
                {weightingSlider("noshow_2yr", "Past 2 years")}
                {weightingSlider("noshow_3yr", "Past 3 years")}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Privileged>
      </Stack>

      <SubmitButton disabled={!eventSeriesId} submitting={props.submitting}>{props.event ? "Update" : "Create"} Event</SubmitButton>
    </form>
  </>
}