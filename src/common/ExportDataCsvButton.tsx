import { Download } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material"
import { saveAs } from 'file-saver';

interface ExportDataCsvButtonProps {
  /** Array of objects to serialise as CSV. Keys of the first object become the column headers. */
  data: {[key: string]: any}[]
  /** Base filename for the downloaded file (without `.csv` extension). Defaults to `"export"`. */
  filename?: string
  /** When true, renders a compact icon-only button instead of a labelled button. */
  iconButton?: boolean
}

/**
 * Builds and downloads a CSV file entirely client-side from a data array.
 *
 * Column headers are derived from the keys of the first object. Values that
 * contain the column delimiter are automatically wrapped in double quotes.
 */
export default function ExportDataCsvButton({data, filename, iconButton}: ExportDataCsvButtonProps){

  const onClick = () => {
    let keys = Object.keys(data[0])

    const columnDelimiter = ","
    const lineDelimiter = "\n"

    let result = ""
	  result += keys.join(columnDelimiter)
	  result += lineDelimiter

    data.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
        if (ctr > 0) {
          result += columnDelimiter
        }

        result += typeof item[key] === "string" && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key]
        ctr++
      })
      result += lineDelimiter
    })

    const blob = new Blob([result], {type: "text/csv;charset=utf-8"});
    saveAs(blob, (filename || "export") + ".csv");
  }

  if(iconButton){
    return <IconButton title="Export" onClick={onClick}><Download /></IconButton>
  }else{
    return <Button startIcon={<Download />} onClick={onClick}>Export</Button>
  }
}