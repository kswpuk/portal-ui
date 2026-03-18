import { FormHelperText, Grid, Rating } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { ReferenceFormInputs, ReferenceFormRatingInputs } from "./ReferenceForm";

interface ReferenceRatingProps {
  /**
   * Name of the field
   */
  name: keyof ReferenceFormRatingInputs

  /**
   * The quality or attribute of the applicant that is being rated.
   * If not provided, then the name of the field is used.
   */
  quality?: string

  /**
   * If true, then an error message will be displayed saying that this field is required.
   */
  error?: boolean

  /**
   * Control object from React Hook Form
   */
  control: Control<ReferenceFormInputs>
}

export default function ReferenceRating(props: ReferenceRatingProps) {
  return <>
    <Grid size={{xs: 12, sm: 6}}>
      How would you rate the applicant's <strong>{props.quality || props.name}</strong>?
      {props.error ? <FormHelperText error>This field is required.</FormHelperText> : null}
    </Grid>
    <Grid size={{xs: 12, sm: 6}}>
      <Controller
        name={props.name}
        control={props.control}
        rules={{ required: true }}
        render={(p) => <Rating name={p.field.name} onChange={p.field.onChange} />}
      />
    </Grid>
  </>
}