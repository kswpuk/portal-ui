import { Download } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material"
import { useEffect, useState } from "react";
import { useExportQuery } from "../redux/membersApi";
import { saveAs } from 'file-saver';

interface ExportCsvButtonProps {
  /** Membership numbers to include in the export. When empty, all members are exported. */
  selected?: string[]
  /** Optional event ID to scope the export to a specific event's attendees. */
  event?: string
  /** Base filename for the downloaded file (without `.csv` extension). Defaults to `"export"`. */
  filename?: string
  /** When true, renders a compact icon-only button instead of a labelled button. */
  iconButton?: boolean
}

/**
 * Triggers a server-side CSV export and downloads the result.
 *
 * Shows a spinner while the export is in progress. The button label switches
 * between "Export Selected" (when `selected` is non-empty) and "Export All".
 */
export default function ExportCsvButton({selected, event, filename, iconButton}: ExportCsvButtonProps){
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