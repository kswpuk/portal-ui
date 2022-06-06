import { Close } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Error from "../common/Error";
import SubmitButton from "../common/SubmitButton";
import { ALLOCATED, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts";
import { useAllocateToEventMutation } from "../redux/eventsApi";

export default function AddAllocationDialog(props) {
  const { register, handleSubmit, formState: { errors } } = useForm({mode: 'onTouched'});
  const [allocateToEvent, {isLoading: isAllocating, isSuccess: isAllocated, error: allocationError}] = useAllocateToEventMutation()

  const onSubmit = (data) => {
    allocateToEvent({eventSeriesId: props.eventSeriesId, eventId: props.eventId, "allocations": [{"allocation": data.allocation, "membershipNumbers": [data.membershipNumber]}], social})
  }

  const close = props.onClose
  const social = props.social

  useEffect(() => {
    if(isAllocated){
      close()
    }
  }, [isAllocated, close])

  return <Dialog onClose={close} open={props.show} maxWidth="md" fullWidth>
    <DialogTitle>
      Add Allocation
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
        {allocationError ? <Error error={allocationError}>Unable to add allocation</Error> : null}

        <TextField variant="outlined" label="Scout Membership Number"
          error={errors.membershipNumber != null} helperText={errors.membershipNumber ? "This field is required and must be a number" : null}
          required fullWidth 
          {...register("membershipNumber", {required: true, pattern: /^[1-9][0-9]+$/})} />
        
        <FormControl fullWidth>
          <InputLabel id="allocation-label">Allocation</InputLabel>
          <Select
              required defaultValue={REGISTERED}
              labelId="allocation-label" label="Allocation"
              inputProps={register("allocation")}>
            <MenuItem value={REGISTERED}>Registered</MenuItem>
            <Divider />
            <MenuItem value={ALLOCATED}>Allocated</MenuItem>
            <MenuItem value={RESERVE}>Reserve</MenuItem>
            <MenuItem value={NOT_ALLOCATED}>Not Allocated</MenuItem>
            <MenuItem value={DROPPED_OUT}>Dropped Out</MenuItem>
            <Divider />
            <MenuItem value={ATTENDED}>Attended</MenuItem>
            <MenuItem value={NO_SHOW}>No Show</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </DialogContent>

    <DialogActions>
      <SubmitButton onClick={handleSubmit(onSubmit)} disabled={Object.keys(errors).length > 0} submitting={isAllocating}>Add Allocation</SubmitButton>
    </DialogActions>
  </Dialog>
}