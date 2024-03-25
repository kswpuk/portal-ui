import { Download } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material"
import { useEffect, useState } from "react";
import { useExportQuery } from "../redux/membersApi";
import { saveAs } from 'file-saver';

export default function ExportCsvButton({selected, event, filename, iconButton}){
  const [clicked, setClicked] = useState(-1);
  const {data: exportedCsv, isFetching: isExporting, fulfilledTimeStamp} = useExportQuery({members: selected || [], event: event, requestedAt: clicked}, {skip: clicked < 0})

  useEffect(() => {
    setClicked(-1)

    if(exportedCsv && fulfilledTimeStamp) {
      const blob = new Blob([exportedCsv], {type: "text/csv;charset=utf-8"});
      saveAs(blob, (filename || "export") + ".csv");
    }
  }, [fulfilledTimeStamp, exportedCsv, filename])

  const onClick = () => {
    setClicked(new Date().getTime())
  }

  const buttonText = selected?.length === 0 ? "Export All" : "Export Selected"

  if(iconButton){
    return <IconButton disabled={isExporting} title={buttonText} onClick={onClick}>{isExporting ? <CircularProgress size={24} /> : <Download />}</IconButton>
  }else{
    return <Button startIcon={isExporting ? <CircularProgress size={16} /> : <Download />} disabled={isExporting} onClick={onClick}>{buttonText}</Button>
  }
}