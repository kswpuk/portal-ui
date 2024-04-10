import { AddCircle, Assistant, Close, Email } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom"

import { ALLOCATED, ATTENDED, DROPPED_OUT, NOT_ALLOCATED, NO_SHOW, REGISTERED, RESERVE } from "../consts"

import ButtonMenu from "../common/ButtonMenu";
import Privileged from "../common/Privileged";
import { useAllocateToEventMutation, useSuggestAllocationsQuery } from "../redux/eventsApi";
import { useEffect, useState } from "react";
import AddAllocationDialog from "./AddAllocationDialog";
import { fetchAuthSession } from 'aws-amplify/auth'
import AllocationWidget from "./AllocationWidget";
import EmailLink from "../common/EmailLink";
import ExportCsvButton from "../common/ExportCsvButton";

export default function ViewAllocationsDialog({event, open, onClose}) {
  const eventId = event.eventId
  const eventSeriesId = event.eventSeriesId

  const [showAddAllocation, setShowAddAllocation] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  
  const [committee, setCommittee] = useState(false);
  const [eventsCoord, setEventsCoord] = useState(false);
  const [socialsCoord, setSocialsCoord] = useState(false);
  const [suggest, setSuggest] = useState(false);

  const [allocateToEvent, {isLoading: isAllocating}] = useAllocateToEventMutation()
  const {data: suggestion, isLoading: isSuggesting} = useSuggestAllocationsQuery({eventSeriesId, eventId}, {skip: !suggest})

  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"];

    setCommittee(groups.includes("MANAGER") || groups.includes("COMMITTEE"));
    setEventsCoord(groups.includes("MANAGER") || groups.includes("EVENTS"));
    setSocialsCoord(groups.includes("SOCIALS"));
  })

  useEffect(() => {
    if(suggestion) {
      setSelectionModel(suggestion)
    }
  }, [suggestion])

  const suggestAllocations = () => {
    setSuggest(true);

    if(suggestion){
      setSelectionModel(suggestion)
    }
  }

  let emails = null

  const allocationColumns=[
    {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
      renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><Link component={RouterLink} to={"/members/"+params.value+"/view"}>{params.value}</Link></Privileged>},
    {field: "name", headerName: "First Name", flex: 2, hideable: false, valueGetter:  (value, row, column, apiRef) => row.preferredName || row.firstName},
    {field: "surname", headerName: "Surname", flex: 2, hideable: false},
    {field: "allocation", headerName: "Allocation", flex: 2, hideable: false,
      renderCell: params => <AllocationWidget textOnly allocation={params.value} />}
  ]
  if(committee){
    allocationColumns.push({field: "email", headerName: "E-mail", flex: 2, hideable: false,
      renderCell: params => <EmailLink>{params.value}</EmailLink>})
    allocationColumns.push({field: "receivedNecker", headerName: "Has Necker?", flex: 1, hideable: false,
      renderCell: params => params.value ? "Yes" : "No"})
    emails = event.allocations.filter(a => selectionModel.includes(a.membershipNumber)).map(a => a.email).join(',')
  }

  return <>
    <Dialog onClose={onClose} open={open} maxWidth="lg" fullWidth>
      <DialogTitle>
        Allocations for {event.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DataGrid autoHeight initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 25 } },
          sorting: {
            sortModel: [{ field: "surname", sort: "asc"}]
          }
          }} columns={allocationColumns} rows={event.allocations}
          getRowId={(row) => row.membershipNumber}
          getRowClassName={(params) => `allocation_${params.row.allocation}`}
          checkboxSelection={eventsCoord || (socialsCoord && event.type === "social")}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          rowSelectionModel={selectionModel}
        />
      </DialogContent>
      <Privileged allowed={event.type === "social" ? ["EVENTS", "SOCIALS"] : ["EVENTS"]}>

        <DialogActions>
          <IconButton title="E-mail Selected" disabled={selectionModel.length === 0} sx={{marginRight: '8px'}} href={"mailto:?subject="+event.name+"&bcc="+emails}><Email /></IconButton>
          <ExportCsvButton iconButton selected={selectionModel} event={eventSeriesId + "/" + eventId} filename={`event_${eventSeriesId}_${eventId}${selectionModel.length > 0 ? "_selected" : ""}`} />
          <IconButton title="Add Allocation" onClick={() => setShowAddAllocation(true)}><AddCircle /></IconButton>
          <Privileged allowed={["EVENTS"]}>
            <IconButton title="Suggest Allocations" onClick={suggestAllocations} disabled={isSuggesting || selectionModel === suggestion}><Assistant /></IconButton>
          </Privileged>

          <ButtonMenu buttonText="Update Allocations" disabled={selectionModel.length === 0 || isAllocating}>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": REGISTERED, "membershipNumbers": selectionModel}], social: socialsCoord})}>Registered</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ALLOCATED, "membershipNumbers": selectionModel}], social: socialsCoord})}>Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": RESERVE, "membershipNumbers": selectionModel}], social: socialsCoord})}>Reserve</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NOT_ALLOCATED, "membershipNumbers": selectionModel}], social: socialsCoord})}>Not Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": DROPPED_OUT, "membershipNumbers": selectionModel}], social: socialsCoord})}>Dropped Out</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ATTENDED, "membershipNumbers": selectionModel}], social: socialsCoord})}>Attended</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NO_SHOW, "membershipNumbers": selectionModel}], social: socialsCoord})}>No Show</MenuItem>
          </ButtonMenu>
        </DialogActions>
      </Privileged>
    </Dialog>
    
    <Privileged allowed={event.type === "social" ? ["EVENTS", "SOCIALS"] : ["EVENTS"]}>
      <AddAllocationDialog show={showAddAllocation} social={socialsCoord} onClose={() => setShowAddAllocation(false)} eventId={eventId} eventSeriesId={eventSeriesId} />
    </Privileged>
  </>
}