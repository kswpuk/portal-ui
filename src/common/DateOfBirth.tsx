import { useTheme } from "@mui/material";
import { JSX } from "react";

interface DateOfBirthProps {
  /**
   * Element (or string) containing the date of birth which we should display.
   * If the content can't be parsed (using `Date.parse()`), then this element will be displayed as is.
   */ 
  children: string | JSX.Element

  /**
   * If true, then the age of the person is displayed after the date.
   * Defaults to true.
   */
  displayAge?: boolean
}

/**
 * Takes a date and wraps it in a `<time>` element, and optionally displays the age in years of someone born on this date.
 */
export default function DateOfBirth(props: DateOfBirthProps){
  const s = String(props.children)
  const theme = useTheme();

  const displayAge = (props.displayAge === undefined ? true : props.displayAge)

  const dob = Date.parse(s)
  if(isNaN(dob)){
    return s
  }else {
    const age = (new Date(Date.now() - dob)).getUTCFullYear() - 1970
    return <><time dateTime={s}>{s}</time> {displayAge ? <span style={{color: theme.palette.text.secondary}}>({age} years old)</span> :  null }</>
  }
}