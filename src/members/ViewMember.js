import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Close, Delete, Edit, Email, MoreHoriz, Phone, PhotoCamera } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Link as MUILink, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableRow, Typography, useTheme } from '@mui/material'

import DateOfBirth from '../common/DateOfBirth'
import EmailLink from '../common/EmailLink'
import Error from '../common/Error'
import Loading from '../common/Loading'
import PostcodeLink from '../common/PostcodeLink'
import Privileged from '../common/Privileged'
import TelephoneLink from '../common/TelephoneLink'

import { useDeleteMemberMutation, useGetMemberQuery } from '../redux/membersApi'
import { setTitle } from '../redux/navSlice'
import styles from './ViewMember.module.css'
import { committeeRoles } from '../consts'
import ConfirmLink from '../common/ConfirmLink'
import MemberPhoto from '../common/MemberPhoto'

export default function ViewMember() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const theme = useTheme();

  const { membershipNumber } = useParams()
  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber)
  const [ deleteMember, { isLoading: isDeleting, isSuccess: isDeleted } ] = useDeleteMemberMutation()

  useEffect(() => {
    if(member) {
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
  }

  //TODO: Allocations (Separate Tab?)

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
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' gutterBottom>Personal Information</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>Membership Number</TableCell>
                  <TableCell>{member.membershipNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>{member.firstName}</TableCell>
                </TableRow>
                { member.preferredName ? <TableRow>
                  <TableCell>Preferred Name</TableCell>
                  <TableCell>{member.preferred}</TableCell>
                </TableRow> : null}
                <TableRow>
                  <TableCell>Surname</TableCell>
                  <TableCell>{member.surname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell><DateOfBirth>{member.dateOfBirth}</DateOfBirth></TableCell>
                </TableRow>
                { member.medicalInformation ? <TableRow>
                  <TableCell className={styles.multiLineCell}>Medical Information</TableCell>
                  <TableCell>{member.medicalInformation}</TableCell>
                </TableRow> : null}
                { member.dietaryRequirements ? <TableRow>
                  <TableCell>Dietary Requirements</TableCell>
                  <TableCell className={styles.multiLineCell}>{member.dietaryRequirements}</TableCell>
                </TableRow> : null}
              </TableBody>
            </Table>
          </Box>

          <Box>
            <Typography variant='h5' gutterBottom>Contact Information</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>E-mail Address</TableCell>
                  <TableCell><EmailLink>{member.email}</EmailLink></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Telephone</TableCell>
                  <TableCell><TelephoneLink>{member.telephone}</TelephoneLink></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell className={styles.multiLineCell}>{member.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Postcode</TableCell>
                  <TableCell><PostcodeLink>{member.postcode}</PostcodeLink></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box>
            <Typography variant='h5' gutterBottom>Emergency Contact</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>Emergency Contact Name</TableCell>
                  <TableCell>{member.emergencyContactName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Emergency Contact Telephone</TableCell>
                  <TableCell><TelephoneLink>{member.emergencyContactTelephone}</TelephoneLink></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box>
            <Typography variant='h5' gutterBottom>Membership Information</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>Membership Status</TableCell>
                  <TableCell>{member.status === "ACTIVE" ? "Active" : "Inactive"} <span style={{color: theme.palette.text.secondary}}>({member.status === "ACTIVE" ? "Expires" : "Expired"} {member.membershipExpires})</span></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>{member.role ? committeeRoles[member.role].name : "Standard Member"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Join Date</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Stack>
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