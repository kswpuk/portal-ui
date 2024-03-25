import { useDispatch } from 'react-redux'
import Error from '../common/Error'
import Loading from '../common/Loading'
import { setTitle } from '../redux/navSlice'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import { Link as MUILink } from '@mui/material'
import { useEffect } from 'react'
import { useListApplicationsQuery } from '../redux/applicationsApi'
import { AccessTimeFilled, AccessTimeOutlined, Circle, CircleOutlined } from '@mui/icons-material';
import moment from 'moment';

export default function ListApplications() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setTitle("Applications"))
  }, [dispatch])

  const { data: applications, error, isLoading, refetch } = useListApplicationsQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of applications</Error>
  }

  return <>
    <DataGrid autoHeight initialState={{
      pagination: { paginationModel: { page: 1, pageSize: 25 } },
      sorting: {
        sortModel: [{ field: "surname", sort: "asc"}]
      }
    }} columns={[
        {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
          renderCell: params => <MUILink component={Link} to={"/applications/"+params.value+"/view"}>{params.value}</MUILink>},
        {field: "firstName", headerName: "First Name", flex: 3, hideable: false},
        {field: "surname", headerName: "Surname", flex: 3, hideable: false},
        {field: "submittedAt", headerName: "Application Date", flex: 2, hideable: false, type: 'date',
          valueFormatter:  (value, row, column, apiRef) => moment.unix(value).format("YYYY-MM-DD"),
          valueGetter:  (value, row, column, apiRef) => new Date(value)
        },
        {
          field: "scouting", headerName: "Scout Reference", flex: 1, hideable: false,
          align: "center", headerAlign: "center",
          valueGetter:  (value, row, column, apiRef) => row.applicationStatus.scouting,
          renderCell: params => {
            if(params.value === "ACCEPTED"){
              return <Circle htmlColor='#7413dc' titleAccess='Reference accepted' />
            }else if(params.value === "SUBMITTED"){
              return <CircleOutlined htmlColor='#7413dc' titleAccess='Reference submitted, but not accepted'/>
            }else{
              return "-"
            }
          }
        },
        {
          field: "nonScouting", headerName: "Non-Scout Reference", flex: 1, hideable: false,
          align: "center", headerAlign: "center",
          valueGetter:  (value, row, column, apiRef) => row.applicationStatus.nonScouting,
          renderCell: params => {
            if(params.value === "ACCEPTED"){
              return <Circle htmlColor='#003982' titleAccess='Reference accepted' />
            }else if(params.value === "SUBMITTED"){
              return <CircleOutlined htmlColor='#003982' titleAccess='Reference submitted, but not accepted'/>
            }else{
              return "-"
            }
          }
        },
        {
          field: "fiveYears", headerName: "5+ Years", flex: 1, hideable: false,
          align: "center", headerAlign: "center",
          valueGetter:  (value, row, column, apiRef) => row.applicationStatus.fiveYears,
          renderCell: params => {
            if(params.value === "ACCEPTED"){
              return <AccessTimeFilled titleAccess='Reference accepted' />
            }else if(params.value === "SUBMITTED"){
              return <AccessTimeOutlined titleAccess='Reference submitted, but not accepted'/>
            }else{
              return "-"
            }
          }
        }
      ]} rows={applications}
      getRowId={(row) => row.membershipNumber} />
  </>
}