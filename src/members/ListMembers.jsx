import { useDispatch } from 'react-redux'
import Error from '../common/Error'
import Loading from '../common/Loading'
import { useListMembersQuery } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Link } from 'react-router-dom'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Link as MUILink, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from '@mui/material'
import Privileged from '../common/Privileged'
import {committeeRoles} from '../consts'
import { Close, CompareArrows, Email, MilitaryTech, MoreHoriz } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Help from '../common/Help'
import MemberPhoto from '../common/MemberPhoto'
import { fetchAuthSession } from 'aws-amplify/auth'
import EmailLink from '../common/EmailLink'
import ExportCsvButton from '../common/ExportCsvButton'

export default function ListMembers() {
  const dispatch = useDispatch()
  
  const [isCommittee, setIsCommittee] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);

  fetchAuthSession().then(session => {
    const groups = session.tokens?.accessToken.payload["cognito:groups"];
    setIsManager(groups.includes("MANAGER") || groups.includes("PORTAL"));
    setIsCommittee(groups.includes("MANAGER") || groups.includes("PORTAL") || groups.includes("COMMITTEE"));
  })

  useEffect(() => {
    dispatch(setTitle("Members"))
  }, [dispatch])

  const { data: members, error, isLoading, refetch } = useListMembersQuery()

  const formatStatus = (memberStatus, memberSuspended) => {
    let s = memberStatus;
    if (memberStatus == "ACTIVE") {
      s = "Active"
    } else if (memberStatus == "INACTIVE") {
      s = "Inactive"
    }

    if (memberSuspended) {
      return "Suspended (" + s + ")"
    } else {
      return s
    }
  }

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of current members</Error>
  }

  const managerSpeedDial = isManager ? <SpeedDialAction
    icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/awards"}><MilitaryTech /></MUILink>}
    tooltipTitle="Awards"
    tooltipOpen
  /> : null;

  const committee = members.filter(x => x.role)
  committee.sort((a, b) => (committeeRoles[a.role]["sortOrder"] > committeeRoles[b.role]["sortOrder"]) ? 1 : -1)

  const columns = [
    {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false,
      renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><MUILink component={Link} to={"/members/"+params.value+"/view"}>{params.value}</MUILink></Privileged>},
    {field: "name", headerName: "First Name", flex: 3, hideable: false, valueGetter:  (value, row, column, apiRef) => row.preferredName || row.firstName},
    {field: "surname", headerName: "Surname", flex: 3, hideable: false},
    {field: "status", headerName: "Status", flex: 1, hideable: true, valueGetter:  (value, row, column, apiRef) => formatStatus(row.status, row.suspended)}
  ]
  let emails = null
  let toolbar = null

  let columnsInitialState = {}

  if(isCommittee){
    columns.splice(-1, 0, {field: "email", headerName: "E-mail", flex: 3, hideable: false,
      renderCell: params => <EmailLink>{params.value}</EmailLink>})
    columns.splice(-1, 0, {field: "age", headerName: "Age", type: 'number', flex: 1, hideable: true})
    
    columnsInitialState = {
      columnVisibilityModel: {
        age: false
      }
    }


    emails = members.filter(m => selectionModel.includes(m.membershipNumber)).map(a => a.email).join(',')

    toolbar = () => {
      return <GridToolbarContainer>
        <Button startIcon={<Email />} disabled={selectionModel.length === 0} href={"mailto:?bcc="+emails}>E-mail Selected</Button>
        <ExportCsvButton selected={selectionModel} filename={`members${selectionModel.length > 0 ? "_selected" : ""}`} />
      </GridToolbarContainer>
    }
  }

  let committeeSizes = {
    xs: 150,
    md: 200,
    xl: 300
  }

  return <>
    <Typography variant='h5' gutterBottom>Committee Members</Typography>

    <Grid container spacing={2} sx={{mb: 3, display: "flex", justifyContent: "center"}}>
      {committee.map(x => <Grid key={"committee_"+x.membershipNumber} item>
        <Card variant="outlined" sx={{width: committeeSizes}}>
          <CardMedia component={() => <Box height={committeeSizes} width={committeeSizes}>
            <MemberPhoto membershipNumber={x.membershipNumber}
              width="100%" height="100%"
              alt={(x.preferredName || x.firstName) + " " + x.surname} /></Box>}
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

    <DataGrid checkboxSelection={isCommittee} autoHeight sx={{marginBottom: '3rem'}} initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 25 } },
        filter: {
          filterModel: {
            items: [{ field: "status", operator: "equals", "value": "Active"}]
          }
        },
        sorting: {
          sortModel: [{ field: "surname", sort: "asc"}]
        },
        columns: columnsInitialState
      }}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectionModel(newSelectionModel);
      }}
      rowSelectionModel={selectionModel}
      columns={columns} rows={members}
      getRowId={(row) => row.membershipNumber}
      slots={{
        toolbar: toolbar
      }} />
    
    <Privileged allowed={["MEMBERS"]}>
      <SpeedDial
        ariaLabel="Membership Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >
        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/compare"}><CompareArrows /></MUILink>}
          tooltipTitle="Compare"
          tooltipOpen
        />

        {managerSpeedDial}
      </SpeedDial>
    </Privileged>
  </>
}