import { AddCircle, Assistant, Close, Email } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, MenuItem } from "@mui/material";
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
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
import AllocationSuspendedWidget from "./AllocationSuspendedWidget";

interface ViewAllocationsDialogProps {
  event: EventDetails,

  open: boolean
  onClose: () => void
}

export default function ViewAllocationsDialog({event, open, onClose}: ViewAllocationsDialogProps) {
  const eventId = event.eventId
  const eventSeriesId = event.eventSeriesId

  const [showAddAllocation, setShowAddAllocation] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({type: "include", ids: new Set<GridRowId>([])});
  
  const [committee, setCommittee] = useState(false);
  const [eventsCoord, setEventsCoord] = useState(false);
  const [socialsCoord, setSocialsCoord] = useState(false);
  const [suggest, setSuggest] = useState(false);

  const [allocateToEvent, {isLoading: isAllocating}] = useAllocateToEventMutation()
  const {data: suggestion, isLoading: isSuggesting} = useSuggestAllocationsQuery({eventSeriesId, eventId}, {skip: !suggest})

  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[];

    setCommittee(groups.includes("MANAGER") || groups.includes("PORTAL") || groups.includes("COMMITTEE"));
    setEventsCoord(groups.includes("MANAGER") || groups.includes("PORTAL") || groups.includes("EVENTS"));
    setSocialsCoord(groups.includes("SOCIALS"));
  })

  useEffect(() => {
    if(suggestion) {
      setSelectionModel({type: "include", ids: new Set(suggestion)})
    }
  }, [suggestion])

  const suggestAllocations = () => {
    setSuggest(true);

    if(suggestion){
      setSelectionModel({type: "include", ids: new Set(suggestion)})
    }
  }

  let emails = null
  const allIds = event.allocations.map(a => a.membershipNumber);
  const selectedIds = selectionModel.type === "exclude"
    ? allIds.filter(id => !selectionModel.ids.has(id))
    : Array.from(selectionModel.ids.values()).map(row => row.toString());

  const allocationColumns: GridColDef[] = [
    {field: "membershipNumber", headerName: "Membership Number", flex: 1,
      renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><Link component={RouterLink} to={"/members/"+params.value+"/view"}>{params.value}</Link></Privileged>},
    {field: "name", headerName: "First Name", flex: 2, valueGetter:  (value, row, column, apiRef) => row.preferredName || row.firstName},
    {field: "surname", headerName: "Surname", flex: 2},
    {field: "allocation", headerName: "Allocation", flex: 2,
      renderCell: params => <><AllocationWidget textOnly allocation={params.value} /><Privileged allowed={["COMMITTEE"]}><AllocationSuspendedWidget suspended={params.row.suspended} /></Privileged></>}
  ]
  if(committee){
    allocationColumns.push({field: "email", headerName: "E-mail", flex: 2,
      renderCell: params => <EmailLink>{params.value}</EmailLink>})
    allocationColumns.push({field: "receivedNecker", headerName: "Has Necker?", flex: 1,
      renderCell: params => params.value ? "Yes" : "No"})
    emails = event.allocations.filter(a => selectedIds.includes(a.membershipNumber)).map(a => a.email).join(',')
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
          <IconButton title="E-mail Selected" disabled={selectedIds.length === 0} sx={{marginRight: '8px'}} href={"mailto:?subject="+event.name+"&bcc="+emails}><Email /></IconButton>
          <ExportCsvButton iconButton selected={selectedIds} event={eventSeriesId + "/" + eventId} filename={`event_${eventSeriesId}_${eventId}${selectedIds.length > 0 ? "_selected" : ""}`} />
          <IconButton title="Add Allocation" onClick={() => setShowAddAllocation(true)}><AddCircle /></IconButton>
          <Privileged allowed={["EVENTS"]}>
            <IconButton title="Suggest Allocations" onClick={suggestAllocations} disabled={isSuggesting || selectionModel === suggestion}><Assistant /></IconButton>
          </Privileged>

          <ButtonMenu buttonText="Update Allocations" disabled={selectedIds.length === 0 || isAllocating}>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": REGISTERED, "membershipNumbers": selectedIds}], social: socialsCoord})}>Registered</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ALLOCATED, "membershipNumbers": selectedIds}], social: socialsCoord})}>Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": RESERVE, "membershipNumbers": selectedIds}], social: socialsCoord})}>Reserve</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NOT_ALLOCATED, "membershipNumbers": selectedIds}], social: socialsCoord})}>Not Allocated</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": DROPPED_OUT, "membershipNumbers": selectedIds}], social: socialsCoord})}>Dropped Out</MenuItem>
            <Divider />
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": ATTENDED, "membershipNumbers": selectedIds}], social: socialsCoord})}>Attended</MenuItem>
            <MenuItem onClick={() => allocateToEvent({eventSeriesId, eventId, "allocations": [{"allocation": NO_SHOW, "membershipNumbers": selectedIds}], social: socialsCoord})}>No Show</MenuItem>
          </ButtonMenu>
        </DialogActions>
      </Privileged>
    </Dialog>
    
    <Privileged allowed={event.type === "social" ? ["EVENTS", "SOCIALS"] : ["EVENTS"]}>
      <AddAllocationDialog show={showAddAllocation} social={socialsCoord} onClose={() => setShowAddAllocation(false)} eventId={eventId} eventSeriesId={eventSeriesId} />
    </Privileged>
  </>
}