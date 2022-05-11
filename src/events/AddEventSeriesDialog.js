import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Error from "../common/Error";
import SubmitButton from "../common/SubmitButton";
import { useCreateEventSeriesMutation } from "../redux/eventsApi";

export default function AddEventSeriesDialog(props) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({mode: 'onTouched'});
  const [createEventSeries, {isLoading: isCreating, isSuccess: isCreated, error: creationError, reset: createReset}] = useCreateEventSeriesMutation()

  const nameToId = (name) => {
    return (name || "").toLowerCase()
      .replaceAll(/[^-a-z0-9 ]/g, "")
      .replaceAll(/ +/g, "-")
      .replaceAll(/^-/g, "")
      .substring(0, 20)
      .replaceAll(/-$/g, "")
  }

  const watchName = watch("name")
  const id = nameToId(watchName)

  const onSubmit = (data) => {
    createEventSeries({
      eventSeriesId: id,
      body: data
    })
  }

  const close = props.onClose

  useEffect(() => {
    if(isCreated){
      close()
      createReset()
      reset({
        name: "",
        description: "",
        type: "event"
      })
    }
  }, [isCreated, close, createReset, reset])

  return <Dialog onClose={close} open={props.show} maxWidth="md" fullWidth>
    <DialogTitle>
      Create Event Series
      <IconButton
        aria-label="close"
        onClick={close}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <Stack spacing={3} sx={{marginTop: '0.5rem'}}>
        {creationError ? <Error error={creationError}>Unable to create event series</Error> : null}

        <TextField variant="outlined" label="Name"
          error={errors.name != null} helperText={errors.name ? "This field is required" : "The name of the event series, which should be kept short and generic"}
          required fullWidth 
          {...register("name", {required: true})} />

        <TextField variant="outlined" label="ID"
          value={id} disabled required
          error={(props.existing || []).includes(id) || id.length === 0}
          helperText="This field is auto-generated based on the name given above, and must not be the same as an existing name" />

        <TextField variant="outlined" label="Description"
          error={errors.description != null} helperText={errors.description ? "This field is required" : "The description of the event series, which should provide a generic description of all the events within the series and our role at them."}
          required fullWidth multiline={true} rows={5}
          {...register("description", {required: true})} />

        <FormControl fullWidth>
          <InputLabel id="type-label">Event Type</InputLabel>
          <Select
              required defaultValue="event"
              labelId="type-label" label="Event Type"
              inputProps={register("type")}>
            <MenuItem value="event">Event</MenuItem>
            <MenuItem value="social">Social</MenuItem>
            <MenuItem value="no_impact">No Impact on Allocations</MenuItem>
          </Select>
        </FormControl>

      </Stack>
    </DialogContent>

    <DialogActions>
      <SubmitButton onClick={handleSubmit(onSubmit)} disabled={Object.keys(errors).length > 0 || id.length === 0 || (props.existing || []).includes(id)} submitting={isCreating}>Create Event Series</SubmitButton>
    </DialogActions>
  </Dialog>
}