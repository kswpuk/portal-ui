import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Link, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'

import DateOfBirth from '../common/DateOfBirth'
import EmailLink from '../common/EmailLink'
import Error from '../common/Error'
import Loading from '../common/Loading'
import PostcodeLink from '../common/PostcodeLink'
import TelephoneLink from '../common/TelephoneLink'

import { setTitle } from '../redux/navSlice'
import styles from './ViewApplication.module.css'
import { useApproveApplicationMutation, useDeleteApplicationMutation, useGetApplicationQuery, useListReferencesQuery } from '../redux/applicationsApi'
import { AccessTimeFilled, AccessTimeOutlined, Circle, CircleOutlined, Close, Delete, HowToReg, MoreHoriz } from '@mui/icons-material'
import ConfirmLink from '../common/ConfirmLink'
import EvidenceImage from '../join/EvidenceImage'
import { DataGrid } from '@mui/x-data-grid'
import ReferenceDialog from './ReferenceDialog'

export default function ViewApplication() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { membershipNumber } = useParams()
  const [ showReference, setShowReference] = useState(null)

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
  const refOutstanding = []

  if(referencesLoading){
    refEl = <Loading /> 
  }else if(referencesError){
    return <Error error={referencesError} onRetry={() => referencesRefetch()}>An error occurred whilst loading references for application {membershipNumber}</Error>
  }else{
    if(!references.some(r => r.accepted && r.relationship === "scouting")){
      refOutstanding.push("No Scouting reference has been accepted")
    }
    if(!references.some(r => r.accepted && r.relationship === "nonScouting")){
      refOutstanding.push("No non-Scouting reference has been accepted")
    }
    if(!references.some(r => r.accepted && r.howLong === "moreThan5")){
      refOutstanding.push("No reference has been accepted from anyone that has known the applicant for more than 5 years")
    }

    refEl = <DataGrid disableRowSelectionOnClick autoHeight initialState={{
      pagination: { paginationModel: { page: 0, pageSize: 25 } },
      sorting: {
        sortModel: [{ field: "submittedAt", sort: "asc"}]
      }
    }} columns={[
        {
          field: "referenceName", headerName: "Reference Name", flex: 3, hideable: false,
          renderCell: params => params.row.submittedAt ? <Link href="#" onClick={(event) => {event.preventDefault(); setShowReference(params.row.referenceEmail)}}>{params.value}</Link> : params.value
        },
        {
          field: "referenceEmail", headerName: "Reference E-mail", flex: 3, hideable: false,
          renderCell: params => <Link href={"mailto:"+params.value}>{params.value}</Link>
        },
        {
          field: "submittedAt", headerName: "Date Received", flex: 2, hideable: false, 
          type: 'dateTime', valueGetter: (value, row, column, apiRef) => value && new Date(value*1000)
        },
        {
          field: "relationship", headerName: "Type", flex: 1, hideable: false,
          align: "center", headerAlign: "center",
          renderCell: params => {
            let col = ''
            let text = ''
            if (params.value === "scouting"){
              col = "#7413dc"
              text = "Scouting reference"
            }else if (params.value === "nonScouting"){
              col = "#003982"
              text = "Non-Scouting reference"
            }else{
              return "-"
            }

            if(params.row.accepted){
              return <Circle htmlColor={col} titleAccess={text + ", accepted"} />
            }else{
              return <CircleOutlined htmlColor={col} titleAccess={text + ", not yet accepted"} />
            }
          }
        },
        {
          field: "howLong", headerName: "5+ years", flex: 1, hideable: false,
          align: "center", headerAlign: "center",
          renderCell: params => {
            // Color = gt/lt 5
            // Icon = accepted
            let col, text;
            if(params.value === "moreThan5"){
              col = ''
              text = '5 or more years'
            }else if(params.value === "lessThan5"){
              col = 'disabled'
              text = 'Less than 5 years'
            }else{
              return "-"
            }

            if(params.row.accepted){
              return <AccessTimeFilled color={col} titleAccess={text + ", accepted"} />
            }else{
              return <AccessTimeOutlined color={col} titleAccess={text + ", not yet accepted"} />
            }
          } 
        }
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
        
        {refOutstanding.length > 0 ? <>
          <Typography sx={{mt: '1rem'}}>The following issues are still outstanding:</Typography>
          <ul>
            {refOutstanding.map((val, idx) => <li key={"outstanding_"+idx}><Typography>{val}</Typography></li>)}
          </ul>
        </> : null}

      </Box>

    </Stack>

    <ReferenceDialog open={showReference != null} onClose={() => setShowReference(null)} membershipNumber={membershipNumber} referenceEmail={showReference}/>

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