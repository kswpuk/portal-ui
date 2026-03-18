import { Button, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface SubmitButtonProps {
  children?: ReactNode
  disabled?: boolean
  onClick?: () => void,
  size?: "small" | "medium" | "large"
  submitting?: boolean
  submittingText?: string
  text?: string
}

export default function SubmitButton(props: SubmitButtonProps){
  return <Button 
    startIcon={props.submitting ? <CircularProgress size={24} /> : null} 
    disabled={props.disabled || props.submitting}
    onClick={props.onClick}
    size={props.size || "medium"}
    variant="contained"
    type={props.onClick ? "button": "submit"}>
      {props.submitting ? (props.submittingText || "Submitting...") : (props.text || props.children)}
    </Button>
}