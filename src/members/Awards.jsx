import { Link as MUILink, Typography } from "@mui/material"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useMembersAwardsQuery } from "../redux/membersApi"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { setTitle } from "../redux/navSlice"
import { DataGrid } from "@mui/x-data-grid"

export default function Awards() {
  const dispatch = useDispatch()
  const { data: awardSuggestions, error, isLoading } = useMembersAwardsQuery()

  useEffect(() => {
    dispatch(setTitle("Award Suggestions"))
  }, [dispatch])

  if(isLoading){
    return <Loading />
  }else if(error) {
    return <Error error={error}>Unable to load award suggestions</Error>
  }

  return <>
    <Typography variant="body1">
      This tool identifies members who should be considered for a <MUILink component={Link} to="https://www.scouts.org.uk/volunteers/learning-development-and-awards/awards-and-recognition/good-service-awards/">good service award</MUILink>, having shown dedication to the KSWP over the last 5 years.
      5 years is the period over which exemplary service must be shown to receive a good service award.
      The criteria used to identify members who should be considered are as follows:
    </Typography>

    <ul>
      <li>Has been a member of the KSWP for at least 5 years</li>
      <li>Hasn't been a "No Show" at an event they were supposed to attend in the past 5 years</li>
      <li>Hasn't been a "Drop Out" at more than three events in the past 5 years</li>
      <li>Has attended events regularly (at least once every 3 months on average) over the past 5 years</li>
    </ul>

    <Typography variant="body1" gutterBottom>
      Additionally, although not checked here, members should not have received a good service award within the last 5 years.
      This can be checked on Compass.
    </Typography>

    <DataGrid checkboxSelection autoHeight sx={{marginBottom: '3rem'}} initialState={{
        pagination: { paginationModel: { page: 1, pageSize: 25 } },
        sorting: {
          sortModel: [{ field: "surname", sort: "asc"}]
        },
      }}
      columns={[
        {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
          renderCell: params => <MUILink component={Link} to={"/members/"+params.value+"/view"}>{params.value}</MUILink>},
        {field: "firstName", headerName: "First Name", flex: 3, hideable: false},
        {field: "surname", headerName: "Surname", flex: 3, hideable: false},
      ]} rows={awardSuggestions.members}
      getRowId={(row) => row.membershipNumber}
    />
  </>

}