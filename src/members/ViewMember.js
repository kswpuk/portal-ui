import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Close, Delete, Edit, Email, MoreHoriz, Phone, PhotoCamera } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Link as MUILink, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, Typography } from '@mui/material'

import Error from '../common/Error'
import Loading from '../common/Loading'
import Privileged from '../common/Privileged'

import { useDeleteMemberMutation, useGetMemberQuery } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import ConfirmLink from '../common/ConfirmLink'
import MemberPhoto from '../common/MemberPhoto'
import ViewMemberInformation from './ViewMemberInformation'
import ViewMemberAllocations from './ViewMemberAllocations'

export default function ViewMember() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { membershipNumber } = useParams()
  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber)
  const [ deleteMember, { isLoading: isDeleting, isSuccess: isDeleted } ] = useDeleteMemberMutation()

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if(member && member.membershipNumber) {
      dispatch(setTitle((member.preferredName || member.firstName) + " " + member.surname + " (" + membershipNumber + ")"))
    }else{
      dispatch(setTitle(membershipNumber))
    }
  }, [dispatch, member, membershipNumber])
  
  useEffect(() => {
    if(isDeleted){
      navigate("/members")
    }
  }, [navigate, isDeleted])

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading details of member {membershipNumber}</Error>
  }else if(member && !member.membershipNumber){
    return <Error>Member {membershipNumber} does not exist</Error>
  }

  return <>
    <Grid container spacing={3}>
      <Grid item md={4}>
        <Card>
          <CardMedia component={() => 
            <MemberPhoto membershipNumber={member.membershipNumber}
              alt={(member.preferredName || member.firstName) + " " + member.surname} />}
            />
          <CardContent>
            <Typography variant="h5">{(member.preferredName || member.firstName)} {member.surname}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Member No: {member.membershipNumber}</Typography>
          </CardContent>
          
          <CardActions>
            <Button startIcon={<Email />} href={"mailto:"+member.email}>E-mail</Button>
            <Button startIcon={<Phone />} href={"tel:"+member.telephone}>Call</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={true}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{marginBottom: '1rem'}}>
          <Tab label="Personal Information" />
          <Tab label="Allocations" />
        </Tabs>

        {selectedTab === 0 ? <ViewMemberInformation member={member} /> : <ViewMemberAllocations membershipNumber={membershipNumber} />}
        
      </Grid>
    </Grid>

    <Privileged allowed={["MEMBERS"]}>
      <SpeedDial
        ariaLabel="Member Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >

        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/"+membershipNumber+"/edit"}><Edit /></MUILink>}
          tooltipTitle="Edit"
          tooltipOpen
        />

        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/"+membershipNumber+"/photo"}><PhotoCamera /></MUILink>}
          tooltipTitle="Photo"
          tooltipOpen
        />

        <SpeedDialAction 
          icon={<ConfirmLink sx={{display: "flex"}} title={"Delete "+membershipNumber+"?"} loading={isDeleting}
            onConfirm={() => deleteMember(membershipNumber)}
            body={"Are you sure you wish to delete "+(member.preferredName || member.firstName)+" "+member.surname+"? This action is permanent, and cannot be undone."}><Delete />
          </ConfirmLink>}
          tooltipTitle="Delete"
          tooltipOpen
        />
      </SpeedDial>
    </Privileged>
  </>
}