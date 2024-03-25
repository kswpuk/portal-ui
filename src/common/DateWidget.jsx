import moment from "moment"

export default function DateWidget(props){
  const d = new moment(props.date)

  return <time dateTime={props.dateOnly ? d.format("YYYY-MM-DD") : d.format("YYYY-MM-DD HH:mm:ss")}>{d.format(props.format || (props.dateOnly ? "D MMMM YYYY" : "HH:mm, D MMMM YYYY"))}</time>
}