import { CircularProgress } from "@mui/material";
import styles from './Loading.module.css'

interface LoadingProps {
  /** Text shown below the spinner. Defaults to `"Loading..."`. */
  text?: string
}

/**
 * A centred loading spinner with a text label.
 *
 * Used as a full-area placeholder while async data is being fetched.
 */
export default function Loading(props: LoadingProps) {
  return <div className={styles.Loading}>
    <CircularProgress className={styles.LoadingSpinner} />
    <div className={styles.LoadingText}>{props.text || "Loading..."}</div>
  </div>
}