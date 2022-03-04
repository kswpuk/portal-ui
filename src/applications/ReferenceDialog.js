import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, Rating, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import Error from "../common/Error";
import Loading from "../common/Loading";
import SubmitButton from "../common/SubmitButton";
import { useAcceptReferenceMutation, useGetReferenceQuery } from "../redux/applicationsApi";
import styles from './ReferenceDialog.module.css'

export default function ReferenceDialog(props) {
  const { data, error, isLoading } = useGetReferenceQuery({membershipNumber: props.membershipNumber, referenceEmail: props.referenceEmail}, {skip: props.referenceEmail == null})
  const [ acceptReference, {isLoading: isAccepting}] = useAcceptReferenceMutation()

  let dialog = null
  if(isLoading){
    dialog = <>
      <DialogTitle>Reference from {props.referenceEmail}</DialogTitle>
      <DialogContent>
        <Loading />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </>
  }else if(error){
    dialog = <>
      <DialogTitle>Reference from {props.referenceEmail}</DialogTitle>
      <DialogContent>
        <Error error={error} noJump>Unable to load reference</Error>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </>
  }else if(data){
    dialog = <>
      <DialogTitle>Reference from {data.referenceName}</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' gutterBottom>Referee</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>Name</TableCell>
                  <TableCell>{data.referenceName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>E-mail</TableCell>
                  <TableCell><Link href={"mailto:"+data.referenceEmail}>{data.referenceEmail}</Link></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>{new Date(data.submittedAt*1000).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box>
            <Typography variant='h5' gutterBottom>Relationship</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>How do you know the applicant?</TableCell>
                  <TableCell>{data.relationship === "scouting" ? "Through Scouting" : "Outside of Scouting"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>In what capacity do you know the applicant?</TableCell>
                  <TableCell>{data.capacityKnown}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>How long have you known the applicant?</TableCell>
                  <TableCell>{data.howLong === "lessThan5" ? "Less than 5 years" : "5 or more years"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box>
            <Typography variant='h5' gutterBottom>Reference</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{width: '33%'}}>Do you know of any reason the applicant should <em>NOT</em> be considered?</TableCell>
                  <TableCell>{data.notConsidered === true ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Statement of Support</TableCell>
                  <TableCell className={styles.multiLineCell}>{data.statementOfSupport}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maturity</TableCell>
                  <TableCell><Rating readOnly value={data.maturity} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Responsibility</TableCell>
                  <TableCell><Rating readOnly value={data.responsibility} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Self-motivation</TableCell>
                  <TableCell><Rating readOnly value={data.selfMotivation} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ability to motivate others</TableCell>
                  <TableCell><Rating readOnly value={data.motivateOthers} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Commitment</TableCell>
                  <TableCell><Rating readOnly value={data.commitment} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trustworthiness</TableCell>
                  <TableCell><Rating readOnly value={data.trustworthiness} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ability to work with adults</TableCell>
                  <TableCell><Rating readOnly value={data.workWithAdults} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Respect for others</TableCell>
                  <TableCell><Rating readOnly value={data.respectForOthers} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        { data.accepted ? 
          <SubmitButton onClick={() => acceptReference({membershipNumber: props.membershipNumber, referenceEmail: props.referenceEmail, accept: false})} submitting={isAccepting} text="Unaccept Reference" submittingText="Unaccepting Reference..." /> :
          <SubmitButton onClick={() => acceptReference({membershipNumber: props.membershipNumber, referenceEmail: props.referenceEmail, accept: true})} submitting={isAccepting} text="Accept Reference" submittingText="Accepting Reference..." />
        }
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </>
  }

  return <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md" scroll="paper">
    {dialog}
  </Dialog>
}