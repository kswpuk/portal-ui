import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";

export default function SelectEventSeriesWidget(props){
  const sortedSeries = [...props.series]
  sortedSeries.sort((a, b) => a.name > b.name ? 1 : -1)

  const [selected, setSelected] = useState(props.selected || "")
  const handleChange = (event) => {
    setSelected(event.target.value);
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };  

  return <>
    <FormControl fullWidth sx={{marginTop: '0.5rem'}} disabled={props.selected ? true : false}>
      <InputLabel id={props.id || "selectEventSeries-label"}>{props.label || "Event Series"}</InputLabel>
      <Select
        required
        labelId={props.id || "selectEventSeries-label"}
        label={props.label || "Event Series"}
        value={selected} onChange={handleChange}>
          {sortedSeries.map(s => <MenuItem key={s.eventSeriesId} value={s.eventSeriesId}>{s.name}</MenuItem>)}
      </Select>
      <Typography variant="body2" sx={{marginTop: '1rem', marginBottom: '1rem'}}>{props.series.find(s => s.eventSeriesId === selected)?.description}</Typography>
    </FormControl>
  </>
}