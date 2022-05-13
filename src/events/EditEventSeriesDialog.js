import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Error from "../common/Error";
import SubmitButton from "../common/SubmitButton";
import Warning from "../common/Warning";
import { useEditEventSeriesMutation } from "../redux/eventsApi";

export default function EditEventSeriesDialog(props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({mode: 'onTouched'});
  const [editEventSeries, {isLoading: isEditing, isSuccess: isEdited, error: editError, reset: editReset}] = useEditEventSeriesMutation()

  const onSubmit = (data) => {
    editEventSeries({
      eventSeriesId: props.event.eventSeriesId,
      body: data
    })
  }

  const close = props.onClose

  useEffect(() => {
    if(isEdited){
      close()
      editReset()
    }
  }, [isEdited, close, editReset])

  useEffect(() => {
    reset({
      name: props.event?.name,
      description: props.event?.description,
      type: props.event?.type || "event"
    })
  }, [props.event, reset])

  return <Dialog onClose={close} open={props.show} maxWidth="md" fullWidth>
    <DialogTitle>
      Update Event Series
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
      <Warning>
        Updating the event series will update the name, description, and event type for all events that are part of this series, including past events.
      </Warning>
      <Stack spacing={3} sx={{marginTop: '1rem'}}>
        {editError ? <Error error={editError}>Unable to update event series</Error> : null}

        <TextField variant="outlined" label="Name"
          error={errors.name != null} helperText={errors.name ? "This field is required" : "The name of the event series, which should be kept short and generic"}
          required fullWidth 
          {...register("name", {required: true})} />

        <TextField variant="outlined" label="Description"
          error={errors.description != null} helperText={errors.description ? "This field is required" : "The description of the event series, which should provide a generic description of all the events within the series and our role at them."}
          required fullWidth multiline={true} rows={5}
          {...register("description", {required: true})} />

        <FormControl fullWidth>
          <InputLabel id="type-label">Event Type</InputLabel>
          <Controller control={control} name="type"
            render={({ field: { onChange, value}}) => (
              <Select
                onChange={onChange} value={value}
                required labelId="type-label" label="Event Type">
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="no_impact">No Impact on Allocations</MenuItem>
            </Select>
            )}
          />

        </FormControl>

      </Stack>
    </DialogContent>

    <DialogActions>
      <SubmitButton onClick={handleSubmit(onSubmit)} disabled={Object.keys(errors).length > 0} submitting={isEditing}>Edit Event Series</SubmitButton>
    </DialogActions>
  </Dialog>
}