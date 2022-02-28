import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'

import DateOfBirth from '../common/DateOfBirth'
import EmailLink from '../common/EmailLink'
import Error from '../common/Error'
import Loading from '../common/Loading'
import PostcodeLink from '../common/PostcodeLink'
import TelephoneLink from '../common/TelephoneLink'

import { setTitle } from '../redux/navSlice'
import styles from './ViewApplication.module.css'
import { useApproveApplicationMutation, useDeleteApplicationMutation, useGetApplicationQuery, useListReferencesQuery } from '../redux/applicationsApi'
import { Close, Delete, HowToReg, MoreHoriz } from '@mui/icons-material'
import ConfirmLink from '../common/ConfirmLink'
import EvidenceImage from '../join/EvidenceImage'
import { DataGrid } from '@mui/x-data-grid'

export default function ViewApplication() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { membershipNumber } = useParams()

  const { data: application, error, isLoading, refetch } = useGetApplicationQuery(membershipNumber)
  const { data: references, error: referencesError, isLoading: referencesLoading, refetch: referencesRefetch } = useListReferencesQuery(membershipNumber)

  const [ deleteApplication, { isLoading: isDeleting, isSuccess: isDeleted } ] = useDeleteApplicationMutation()
  const [ approveApplication, { isLoading: isApproving, isSuccess: isApproved } ] = useApproveApplicationMutation()

  useEffect(() => {
    if(application) {
      dispatch(setTitle("Application from "+(application.preferredName || application.firstName) + " " + application.surname + " (" + membershipNumber + ")"))
    }else{
      dispatch(setTitle("Application from "+membershipNumber))
    }
  }, [dispatch, application, membershipNumber])

  useEffect(() => {
    if(isDeleted || isApproved){
      navigate("/applications")
    }
  }, [navigate, isDeleted, isApproved])
  
  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading details of application {membershipNumber}</Error>
  }

  let refEl = null
  if(referencesLoading){
    refEl = <Loading /> 
  }else if(referencesError){
    return <Error error={referencesError} onRetry={() => referencesRefetch()}>An error occurred whilst loading references for application {membershipNumber}</Error>
  }else{
    refEl = <DataGrid autoHeight initialState={{
      pagination: {
        pageSize: 5,
      },
      sorting: {
        sortModel: [{ field: "dateReceived", sort: "asc"}]
      }
    }} columns={[
        {field: "referenceName", headerName: "Reference Name", flex: 2, hideable: false},
        {field: "referenceEmail", headerName: "Reference E-mail", flex: 2, hideable: false},
        {field: "dateReceived", headerName: "Date Received", flex: 1, hideable: false}
      ]} rows={references}
      getRowId={(row) => row.referenceEmail} />
  }

  return <>
    <Stack spacing={3}>
      <Box>
        <Typography variant='h5' gutterBottom>Personal Information</Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{width: '33%'}}>Membership Number</TableCell>
              <TableCell>{application.membershipNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>{application.firstName}</TableCell>
            </TableRow>
            { application.preferredName ? <TableRow>
              <TableCell>Preferred Name</TableCell>
              <TableCell>{application.preferred}</TableCell>
            </TableRow> : null}
            <TableRow>
              <TableCell>Surname</TableCell>
              <TableCell>{application.surname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date of Birth</TableCell>
              <TableCell><DateOfBirth>{application.dateOfBirth}</DateOfBirth></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>Contact Information</Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{width: '33%'}}>E-mail Address</TableCell>
              <TableCell><EmailLink>{application.email}</EmailLink></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Telephone</TableCell>
              <TableCell><TelephoneLink>{application.telephone}</TelephoneLink></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell className={styles.multiLineCell}>{application.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Postcode</TableCell>
              <TableCell><PostcodeLink>{application.postcode}</PostcodeLink></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>Award Information</Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{width: '33%'}}>Award Received</TableCell>
              <TableCell>{application.qsaReceived}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Award Evidence</TableCell>
              <TableCell><EvidenceImage membershipNumber={application.membershipNumber}/></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>References</Typography>
        
        {refEl}
      </Box>

    </Stack>

    <SpeedDial
        ariaLabel="Member Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >

        <SpeedDialAction
          icon={<ConfirmLink sx={{display: "flex"}} title={"Approve "+membershipNumber+"?"} loading={isApproving}
            onConfirm={() => approveApplication(membershipNumber)}
            body={"Are you sure you wish to approve the application from "+(application.preferredName || application.firstName)+" "+application.surname+"?"}>
              <HowToReg />
          </ConfirmLink>}
          tooltipTitle="Approve"
          tooltipOpen
        />

        <SpeedDialAction 
          icon={<ConfirmLink sx={{display: "flex"}} title={"Delete "+membershipNumber+"?"} loading={isDeleting}
            onConfirm={() => deleteApplication(membershipNumber)}
            body={"Are you sure you wish to delete the application from "+(application.preferredName || application.firstName)+" "+application.surname+"? This action is permanent, and cannot be undone."}>
              <Delete />
          </ConfirmLink>}
          tooltipTitle="Delete"
          tooltipOpen
        />
      </SpeedDial>
  </>
}