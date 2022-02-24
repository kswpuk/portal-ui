import { Button, CircularProgress } from "@mui/material";

export default function SubmitButton(props){
return <Button startIcon={props.submitting ? <CircularProgress size={24} /> : null} disabled={props.disabled || props.submitting} variant="contained" type="submit">{props.submitting ? props.submittingText : props.text}</Button>
}