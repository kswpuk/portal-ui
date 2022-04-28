import { Box, Stack, Table, TableBody, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import DateOfBirth from "../common/DateOfBirth";
import EmailLink from "../common/EmailLink";
import PostcodeLink from "../common/PostcodeLink";
import TelephoneLink from "../common/TelephoneLink";
import styles from './ViewMember.module.css'
import { committeeRoles } from '../consts'

export default function ViewMemberInformation({member}) {
  const theme = useTheme();

  return <Stack spacing={3}>
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
            <TableCell>{member.preferredName}</TableCell>
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
            <TableCell>{member.status === "ACTIVE" ? "Active" : "Inactive"} <span style={{color: theme.palette.text.secondary}}>({!member.membershipExpires ? "New Member" : (member.status === "ACTIVE" ? "Expires " : "Expired ") + member.membershipExpires})</span></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>{member.role ? committeeRoles[member.role].name : "Standard Member"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Join Date</TableCell>
            <TableCell>{member.joinDate}</TableCell>
          </TableRow>
          {member.receivedNecker !== undefined ? <TableRow>
            <TableCell>Received Necker</TableCell>
            <TableCell>{member.receivedNecker ? "Yes" : "No"}</TableCell>
          </TableRow> : null }
        </TableBody>
      </Table>
    </Box>
  </Stack>
}