import { SyntheticEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Block, Close, Delete, Edit, Email, MoreHoriz, Phone, PhotoCamera } from '@mui/icons-material'
import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardMedia, Grid, Link as MUILink, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, Tabs, Typography } from '@mui/material'

import Error from '../common/Error'
import Loading from '../common/Loading'
import Privileged from '../common/Privileged'

import { useDeleteMemberMutation, useGetMemberQuery, useSetSuspendedMutation } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import ConfirmLink from '../common/ConfirmLink'
import MemberPhoto from '../common/MemberPhoto'
import ViewMemberInformation from './ViewMemberInformation'
import ViewMemberAllocations from './ViewMemberAllocations'
import ViewMemberEventSeries from './ViewMemberEventSeries'
import { useAppDispatch } from '../redux/hooks'

export default function ViewMember() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const { membershipNumber } = useParams()

  if (membershipNumber === undefined) {
    return <Error>Membership number not specified</Error>
  }

  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber)
  const [ deleteMember, { isLoading: isDeleting, isSuccess: isDeleted } ] = useDeleteMemberMutation()
  const [ suspendMember, { isLoading: isSuspending } ] = useSetSuspendedMutation()

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
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

  if(isLoading || member === undefined){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading details of member {membershipNumber}</Error>
  }else if(member && !member.membershipNumber){
    return <Error>Member {membershipNumber} does not exist</Error>
  }

  return <>
    <Grid container spacing={3}>
      <Grid size={{md: 4}}>
        <Card>
          <CardMedia component={() => 
            <MemberPhoto membershipNumber={member.membershipNumber}
              alt={(member.preferredName || member.firstName) + " " + member.surname} />}
            />
          <CardContent>
            <Typography variant="h5">{(member.preferredName || member.firstName)} {member.surname}</Typography>
            <Typography gutterBottom variant="subtitle1" color="text.secondary">Member No: {member.membershipNumber}</Typography>

            <Privileged allowed={["COMMITTEE"]}>
              {member.suspended ? <Alert severity='error'>
                <AlertTitle>Membership Suspended</AlertTitle>
                <Typography variant='body1'>
                  This member is currently suspended from the KSWP, and not able to attend events.
                  If you require more information, please contact the <MUILink href="mailto:manager@kswp.org.uk">KSWP Manager</MUILink> or <MUILink href="mailto:members@kswp.org.uk">Membership Coordinator</MUILink>.
                </Typography>
              </Alert> : null }
            </Privileged>
          </CardContent>
          
          <CardActions>
            <Button startIcon={<Email />} href={"mailto:"+member.email}>E-mail</Button>
            <Button startIcon={<Phone />} href={"tel:"+member.telephone}>Call</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid sx={{flex: 1}}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{marginBottom: '1rem'}}>
          <Tab label="Personal Information" />
          <Tab label="Allocations" />
          <Tab label="Event Series" />
        </Tabs>

        {selectedTab === 0 ? <ViewMemberInformation member={member} /> : (selectedTab === 1 ? <ViewMemberAllocations membershipNumber={membershipNumber} /> : <ViewMemberEventSeries membershipNumber={membershipNumber} />)}
        
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
          slotProps={{
            tooltip: {
              title: "Edit",
              open: true
            }
          }}
        />

        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/members/"+membershipNumber+"/photo"}><PhotoCamera /></MUILink>}
          slotProps={{
            tooltip: {
              title: "Photo",
              open: true
            }
          }}
        />

        <SpeedDialAction 
          icon={<ConfirmLink sx={{display: "flex"}} title={(member.suspended ?  "Unsuspend" : "Suspend")+" "+membershipNumber+"?"} loading={isSuspending}
            onConfirm={() => suspendMember({membershipNumber: membershipNumber, suspended: !member.suspended})}
            body={"Are you sure you wish to "+(member.suspended ?  "unsuspend" : "suspend")+" "+(member.preferredName || member.firstName)+" "+member.surname+"? They will be notified of this action."}><Block />
          </ConfirmLink>}
          slotProps={{
            tooltip: {
              title: member.suspended ?  "Unsuspend" : "Suspend",
              open: true
            }
          }}
        />

        <SpeedDialAction 
          icon={<ConfirmLink sx={{display: "flex"}} title={"Delete "+membershipNumber+"?"} loading={isDeleting}
            onConfirm={() => deleteMember(membershipNumber)}
            body={"Are you sure you wish to delete "+(member.preferredName || member.firstName)+" "+member.surname+"? This action is permanent, and cannot be undone."}><Delete />
          </ConfirmLink>}
          slotProps={{
            tooltip: {
              title: "Delete",
              open: true
            }
          }}
        />
      </SpeedDial>
    </Privileged>
  </>
}