import { Download } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material"
import { saveAs } from 'file-saver';

export default function ExportDataCsvButton({data, filename, iconButton}){

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