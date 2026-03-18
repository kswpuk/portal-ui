import { CircularProgress } from "@mui/material";
import styles from './Loading.module.css'

interface LoadingProps {
  text?: string
}

export default function Loading(props: LoadingProps) {
  return <div className={styles.Loading}>
    <CircularProgress className={styles.LoadingSpinner} />
    <div className={styles.LoadingText}>{props.text || "Loading..."}</div>
  </div>
}