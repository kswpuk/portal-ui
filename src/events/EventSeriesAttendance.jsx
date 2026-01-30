import Error from "../common/Error"
import Loading from "../common/Loading"
import { useGetEventSeriesAllocationsQuery } from "../redux/eventsApi"
import { ALLOCATED, ATTENDED, DROPPED_OUT, NO_SHOW, NOT_ALLOCATED, REGISTERED, RESERVE } from "../consts"
import { Alert, Box, Typography } from "@mui/material"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import ExportDataCsvButton from "../common/ExportDataCsvButton"
import { useListMembersQuery } from "../redux/membersApi"

export default function EventSeriesAttendance({eventSeriesId}) {
  const {data: allocations, isLoading: allocationsIsLoading, error: allocationsError} = useGetEventSeriesAllocationsQuery(eventSeriesId)
  const {data: members, isLoading: membersIsLoading, error: membersError} = useListMembersQuery()

  if(allocationsIsLoading || membersIsLoading){
    return <Loading />
  }else if(allocationsError){
    return <Error error={allocationsError}>Unable to load event series allocations</Error>
  }else if(membersError){
    return <Error error={membersError}>Unable to load member details</Error>
  }

  if (allocations.length === 0){
    return <Alert severity="info">There are currently no allocations for this event series.</Alert>
  }

  let memberNames = {};
  members.forEach(m => memberNames[m.membershipNumber] = `${(m.preferredName || m.firstName)} ${m.surname}`);

  let membersAgg = {};
  for (let a of allocations) {
    let s = membersAgg[a.membershipNumber] || {};
    let v = s[a.allocation] || 0;

    s[a.allocation] = v + 1;
    membersAgg[a.membershipNumber] = s;
  }

  const rows = Object.entries(membersAgg).map(([membershipNumber, memberAllocations]) => ({ 
      "membershipNumber": membershipNumber,
      "name": memberNames[membershipNumber]  || "Unknown Member",
      REGISTERED: memberAllocations[REGISTERED] || 0,
      ALLOCATED: memberAllocations[ALLOCATED] || 0,
      RESERVE: memberAllocations[RESERVE] || 0,
      NOT_ALLOCATED: memberAllocations[NOT_ALLOCATED] || 0,
      DROPPED_OUT: memberAllocations[DROPPED_OUT] || 0,
      ATTENDED: memberAllocations[ATTENDED] || 0,
      NO_SHOW: memberAllocations[NO_SHOW] || 0
    }))
  
  const columns = [
    {field: "membershipNumber", headerName: "Membership Number"},
    {field: "name", headerName: "Name", flex: 1,},
    {field: REGISTERED, headerName: "Registered"},
    {field: ALLOCATED, headerName: "Allocated"},
    {field: RESERVE, headerName: "Reserve List"},
    {field: NOT_ALLOCATED, headerName: "Not Allocated"},
    {field: DROPPED_OUT, headerName: "Dropped Out"},
    {field: ATTENDED, headerName: "Attended"},
    {field: NO_SHOW, headerName: "No Show"}
  ]

  const columnsInitialState = {
    columnVisibilityModel: {
      membershipNumber: true,
      name: true,
      REGISTERED: false,
      ALLOCATED: false,
      RESERVE: false,
      NOT_ALLOCATED: false,
      DROPPED_OUT: false,
      ATTENDED: true,
      NO_SHOW: true
    }
  }

  toolbar = () => {
    return <GridToolbarContainer>
      <ExportDataCsvButton data={rows} filename={`eventseries_${eventSeriesId}_allocations`} />
    </GridToolbarContainer>
  }

  return <>
    <Typography variant="h6" marginBottom="0.5rem">Event Series Allocations</Typography>
    <Box flex flexDirection="column">
      <DataGrid
        columns={columns} rows={rows} 
        getRowId={(row) => row.membershipNumber}
        slots={{
          toolbar: toolbar
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 25 } },
          sorting: {
              sortModel: [{ field: ATTENDED, sort: "desc"}]
            },
          columns: columnsInitialState
        }} />
    </Box>
  </>
}