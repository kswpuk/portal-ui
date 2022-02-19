import { useDispatch } from 'react-redux'
import Error from '../common/Error'
import Loading from '../common/Loading'
import { useListMembersQuery } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Link as MUILink, Typography } from '@mui/material'
import Privileged from '../common/Privileged'
import {committeeRoles} from '../consts'
import { Email } from '@mui/icons-material'
import { useEffect } from 'react'
import Help from '../common/Help'
import MemberPhoto from '../common/MemberPhoto'

export default function ListMembers() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setTitle("Members"))
  }, [dispatch])

  const { data: members, error, isLoading, refetch } = useListMembersQuery()

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of current members</Error>
  }

  const committee = members.filter(x => x.role !== "")
  committee.sort((a, b) => (committeeRoles[a.role]["sortOrder"] > committeeRoles[b.role]["sortOrder"]) ? 1 : -1)

  //TODO: Center grid in small display, hide committee members when small?

  return <>
    <Typography variant='h5' gutterBottom>Committee Members</Typography>

    <Grid container spacing={2} sx={{mb: 3}}>

      {committee.map(x => <Grid key={"committee_"+x.membershipNumber} item>
        <Card variant="outlined">
          <CardMedia component={() => 
            <MemberPhoto membershipNumber={x.membershipNumber}
              width={250} height={250}
              alt={(x.preferredName || x.firstName) + " " + x.surname} />}
            />

          <CardContent>
            <Typography variant="h6">{x.preferredName || x.firstName} {x.surname}</Typography>
            <Typography variant='subtitle2'>{committeeRoles[x.role].name}</Typography>
          </CardContent>
          <CardActions>
            <Button startIcon={<Email />} href={"mailto:"+committeeRoles[x.role].email}>E-mail</Button>
          </CardActions>
        </Card>
      </Grid>)}
    
    </Grid>

    <Typography variant='h5' gutterBottom>All Members 
      <Help>By default, the grid is filtered to only show active members. You can view all members by removing the filter from the Active column. Only one filter can be applied at a time.</Help>
    </Typography>

    <DataGrid autoHeight initialState={{
      pagination: {
        pageSize: 25,
      },
      filter: {
        filterModel: {
          items: [{ columnField: "status", operatorValue: "equals", "value": "ACTIVE"}]
        }
      },
      sorting: {
        sortModel: [{ field: "surname", sort: "asc"}]
      }
    }} columns={[
        {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
          renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><MUILink component={Link} to={"/members/"+params.value+"/view"}>{params.value}</MUILink></Privileged>},
        {field: "firstName", headerName: "First Name", flex: 3, hideable: false},
        {field: "surname", headerName: "Surname", flex: 3, hideable: false},
        {field: "status", headerName: "Status", flex: 1, hideable: true}
      ]} rows={members}
      getRowId={(row) => row.membershipNumber} />
  </>
}