import { useDispatch } from 'react-redux'
import Error from '../common/Error'
import Loading from '../common/Loading'
import { setTitle } from '../redux/navSlice'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import { Link as MUILink } from '@mui/material'
import { useEffect } from 'react'
import { useListApplicationsQuery } from '../redux/applicationsApi'

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
      pagination: {
        pageSize: 25,
      },
      sorting: {
        sortModel: [{ field: "surname", sort: "asc"}]
      }
    }} columns={[
        {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
          renderCell: params => <MUILink component={Link} to={"/applications/"+params.value+"/view"}>{params.value}</MUILink>},
        {field: "firstName", headerName: "First Name", flex: 3, hideable: false},
        {field: "surname", headerName: "Surname", flex: 3, hideable: false}
      ]} rows={applications}
      getRowId={(row) => row.membershipNumber} />
  </>
}