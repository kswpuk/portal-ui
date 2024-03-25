import { FormHelperText, Grid, Rating } from "@mui/material";
import { Controller } from "react-hook-form";

export default function ReferenceRating(props) {
  return <>
    <Grid item xs={12} sm={6}>
      How would you rate the applicant's <strong>{props.quality || props.name}</strong>?
      {props.error ? <FormHelperText error>This field is required.</FormHelperText> : null}
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name={props.name}
        control={props.control}
        rules={{ required: true }}
        render={(p) => <Rating name={p.field.name} onChange={p.field.onChange} />}
      />
    </Grid>
  </>
}