import Error from '../common/Error'
import Loading from '../common/Loading'
import { useListMembersQuery } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel, GridToolbarContainer, Toolbar, ToolbarButton } from '@mui/x-data-grid';
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
import { useAppDispatch } from '../redux/hooks'

interface CommitteeListItem extends MemberListItem {
  role: CommitteeRole
}

export default function ListMembers() {
  const dispatch = useAppDispatch()
  
  const [isCommittee, setIsCommittee] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({type: "include", ids: new Set<GridRowId>([])});

  fetchAuthSession().then(session => {
    const groups: string[] = session.tokens?.accessToken.payload["cognito:groups"] as string[] || [];
    setIsManager(groups.includes("MANAGER") || groups.includes("PORTAL"));
    setIsCommittee(groups.includes("MANAGER") || groups.includes("PORTAL") || groups.includes("COMMITTEE"));
  })

  useEffect(() => {
    dispatch(setTitle("Members"))
  }, [dispatch])

  const { data: members, error, isLoading, refetch } = useListMembersQuery()

  const formatStatus = (memberStatus: MembershipStatus, memberSuspended: boolean) => {
    let s = "";
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

  if(isLoading || members === undefined){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of current members</Error>
  }

  const managerSpeedDial = isManager ? <SpeedDialAction
    icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/awards"}><MilitaryTech /></MUILink>}
    slotProps={{
      tooltip: {
        title: "Awards",
        open: true
      }
    }}
  /> : null;

  const committee = members.filter(x => x.role in committeeRoles) as CommitteeListItem[]
  committee.sort((a, b) => (committeeRoles[a.role]["sortOrder"] > committeeRoles[b.role]["sortOrder"]) ? 1 : -1)

  const columns: GridColDef[] = [
    {field: "membershipNumber", headerName: "Membership Number", flex: 1,
      renderCell: params => <Privileged allowed={["COMMITTEE", params.value]} denyMessage={params.value}><MUILink component={Link} to={"/members/"+params.value+"/view"}>{params.value}</MUILink></Privileged>},
    {field: "name", headerName: "First Name", flex: 3, valueGetter:  (_value, row) => row.preferredName || row.firstName},
    {field: "surname", headerName: "Surname", flex: 3},
    {field: "status", headerName: "Status", flex: 1, valueGetter:  (_value, row) => formatStatus(row.status, row.suspended)}
  ]

  let toolbar = undefined

  let columnsInitialState = {}

  if(isCommittee){
    columns.splice(-1, 0, {field: "email", headerName: "E-mail", flex: 3,
      renderCell: params => <EmailLink>{params.value}</EmailLink>})
    columns.splice(-1, 0, {field: "age", headerName: "Age", type: 'number', flex: 1})
    
    columnsInitialState = {
      columnVisibilityModel: {
        age: false
      }
    }


    let emails = members.filter(m => selectionModel.ids.has(m.membershipNumber)).map(a => a.email).join(',')

    toolbar = () => {
      return <Toolbar>
        <ToolbarButton disabled={selectionModel.ids.size === 0} render={<Button startIcon={<Email />} href={"mailto:?bcc="+emails} />}>
          E-mail Selected
        </ToolbarButton>
        <ToolbarButton render={<ExportCsvButton selected={Array.from(selectionModel.ids.values()).map(row => row.toString())} filename={`members${selectionModel.ids.size > 0 ? "_selected" : ""}`} />} />
      </Toolbar>
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
      {committee.map(x => <Grid key={"committee_"+x.membershipNumber}>
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
      }} showToolbar/>
    
    <Privileged allowed={["MEMBERS"]}>
      <SpeedDial
        ariaLabel="Membership Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >
        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/compare"}><CompareArrows /></MUILink>}
          slotProps={{
            tooltip: {
              title: "Compare",
              open: true
            }
          }}
        />

        {managerSpeedDial}
      </SpeedDial>
    </Privileged>
  </>
}