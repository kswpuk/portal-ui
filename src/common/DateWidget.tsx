import moment from "moment"

interface DateWidgetProps {
  /**
   * The date to display
   */
  date: string

  /**
   * If true, then the date will be shown without any time information
   */
  dateOnly?: boolean

  /**
   * Optional format string for the date
   */
  format?: string
}

/**
 * Displays a date (and optionally time) inside a semantic `<time>` element.
 *
 * The `dateTime` attribute is always machine-readable (ISO-style).
 * The visible text defaults to a human-friendly format but can be overridden
 * via the `format` prop (moment.js format string).
 */
export default function DateWidget(props: DateWidgetProps){
  const d = moment(props.date)

  return <time dateTime={props.dateOnly ? d.format("YYYY-MM-DD") : d.format("YYYY-MM-DD HH:mm:ss")}>{d.format(props.format || (props.dateOnly ? "D MMMM YYYY" : "HH:mm, D MMMM YYYY"))}</time>
}