import Error from "../common/Error"
import Loading from "../common/Loading"
import { useGetMemberAllocationsQuery } from "../redux/membersApi"
import { useListEventSeriesQuery } from "../redux/eventsApi"
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid"
import { ALLOCATED, ATTENDED, DROPPED_OUT, NO_SHOW, NOT_ALLOCATED, REGISTERED, RESERVE } from "../consts"
import { Box } from "@mui/material"
import ExportDataCsvButton from "../common/ExportDataCsvButton"

export default function ViewMemberEventSeries(props) {
  const { data: allocations, error: allocationsError, isLoading: allocationsIsLoading } = useGetMemberAllocationsQuery(props.membershipNumber)
  const {data: series, error: seriesError, isLoading: seriesIsLoading} = useListEventSeriesQuery(false)

  if(allocationsIsLoading || seriesIsLoading){
    return <Loading />
  } else if(allocationsError) {
    return <Error error={allocationsError}>Unable to load allocations</Error>
  } else if(seriesError) {
    return <Error error={seriesError}>Unable to load event series</Error>
  }

  const seriesAllocations = allocations.map(a => (
    {"eventSeriesId": a.combinedEventId.split("/")[0], "allocation": a.allocation}
  ));

  let seriesAllocationAgg = {};
  for (const a of seriesAllocations) {
    let s = seriesAllocationAgg[a.eventSeriesId] || {};
    let v = s[a.allocation] || 0;

    s[a.allocation] = v + 1;
    seriesAllocationAgg[a.eventSeriesId] = s;
  }

  const rows = series.map(s => {
    const saa = seriesAllocationAgg[s.eventSeriesId] || {}

    return {
      "eventSeriesId": s.eventSeriesId,
      "name": s.name,
      REGISTERED: saa[REGISTERED] || 0,
      ALLOCATED: saa[ALLOCATED] || 0,
      RESERVE: saa[RESERVE] || 0,
      NOT_ALLOCATED: saa[NOT_ALLOCATED] || 0,
      DROPPED_OUT: saa[DROPPED_OUT] || 0,
      ATTENDED: saa[ATTENDED] || 0,
      NO_SHOW: saa[NO_SHOW] || 0
    }
  })

  
  const columns = [
    {field: "eventSeriesId", headerName: "Event Series"},
    {field: "name", headerName: "Event Series Name", flex: 1,},
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
      eventSeriesId: false,
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
        <ExportDataCsvButton data={rows} filename={`member_${props.membershipNumber}_series`} />
      </GridToolbarContainer>
    }

  return <Box flex flexDirection="column" justifyItems="center">
    <DataGrid sx={{width: "95%"}}
      columns={columns} rows={rows} 
      getRowId={(row) => row.eventSeriesId}
      slots={{
        toolbar: toolbar
      }}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 25 } },
        sorting: {
            sortModel: [{ field: "name", sort: "asc"}]
          },
        columns: columnsInitialState
      }} />
    </Box>
}