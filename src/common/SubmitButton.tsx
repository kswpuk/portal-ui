import { Button, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

interface SubmitButtonProps {
  /** Button label. Can also be supplied via `text`. */
  children?: ReactNode
  /** Disables the button independently of the `submitting` state. */
  disabled?: boolean
  /**
   * Click handler. When provided the button renders as `type="button"`;
   * when omitted it renders as `type="submit"` for use inside a `<form>`.
   */
  onClick?: () => void
  /** MUI button size. Defaults to `"medium"`. */
  size?: "small" | "medium" | "large"
  /** When true, shows a spinner, disables the button, and displays `submittingText`. */
  submitting?: boolean
  /** Text shown while `submitting` is true. Defaults to `"Submitting..."`. */
  submittingText?: string
  /** Button label. Can also be supplied via `children`. */
  text?: string
}

/**
 * A form submit button with a built-in loading state.
 *
 * Renders a `contained` MUI Button. While `submitting` is true the button is
 * disabled and shows a spinner alongside the `submittingText`.  When `onClick`
 * is provided the button type is `"button"`; otherwise it is `"submit"`.
 */
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