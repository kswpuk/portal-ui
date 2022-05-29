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
import { Auth } from "aws-amplify";
import AllocationWidget from "./AllocationWidget";
import EmailLink from "../common/EmailLink";

export default function ViewAllocationsDialog({event, open, onClose}) {
  const eventId = event.eventId
  const eventSeriesId = event.eventSeriesId

  const [showAddAllocation, setShowAddAllocation] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  
  const [committee, setCommittee] = useState(false);
  const [eventsCoord, setEventsCoord] = useState(false);
  const [suggest, setSuggest] = useState(false);

  const [allocateToEvent, {isLoading: isAllocating}] = useAllocateToEventMutation()
  const {data: suggestion, isLoading: isSuggesting} = useSuggestAllocationsQuery({eventSeriesId, eventId}, {skip: !suggest})

  Auth.currentAuthenticatedUser().then(user => {
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
    setCommittee(groups.includes("MANAGER") || groups.includes("COMMITTEE"));
    setEventsCoord(groups.includes("MANAGER") || groups.includes("EVENTS"));
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
    {field: "name", headerName: "First Name", flex: 2, hideable: false, valueGetter: params => params.row.preferredName || params.row.firstName},
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
          pagination: {
            pageSize: 25,
          },
          sorting: {
            sortModel: [{ field: "surname", sort: "asc"}]
          }
          }} columns={allocationColumns} rows={event.allocations}
          getRowId={(row) => row.membershipNumber}
          getRowClassName={(params) => `allocation_${params.row.allocation}`}
          checkboxSelection={eventsCoord}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
        />
      </DialogContent>
      <Privileged allowed={["EVENTS"]}>

        <DialogActions>
          <IconButton title="E-mail Selected" disabled={selectionModel.length === 0} sx={{marginRight: '8px'}} href={"mailto:?subject="+event.name+"&bcc="+emails}><Email /></IconButton>
          <IconButton title="Add Allocation" onClick={() => setShowAddAllocation(true)}><AddCircle /></IconButton>
          <IconButton title="Suggest Allocations" onClick={suggestAllocations} disabled={isSuggesting || selectionModel === suggestion}><Assistant /></IconButton>

          <ButtonMenu buttonText="Update Allocations" disabled={selectionModel.length === 0 || isAllocating}>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": REGISTERED, "membershipNumbers": selectionModel}]})}>Registered</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ALLOCATED, "membershipNumbers": selectionModel}]})}>Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": RESERVE, "membershipNumbers": selectionModel}]})}>Reserve</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NOT_ALLOCATED, "membershipNumbers": selectionModel}]})}>Not Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": DROPPED_OUT, "membershipNumbers": selectionModel}]})}>Dropped Out</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ATTENDED, "membershipNumbers": selectionModel}]})}>Attended</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NO_SHOW, "membershipNumbers": selectionModel}]})}>No Show</MenuItem>
          </ButtonMenu>
        </DialogActions>
      </Privileged>
    </Dialog>
    
    <Privileged allowed={["EVENTS"]}>
      <AddAllocationDialog show={showAddAllocation} onClose={() => setShowAddAllocation(false)} eventId={eventId} eventSeriesId={eventSeriesId} />
    </Privileged>
  </>
}