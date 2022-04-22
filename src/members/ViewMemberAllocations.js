import { Link as MUILink, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from "@mui/material"
import Error from "../common/Error"
import Loading from "../common/Loading"
import { useGetMemberAllocationsQuery } from "../redux/membersApi"
import AllocationWidget from "../events/AllocationWidget"
import DateWidget from "../common/DateWidget"
import { Link } from "react-router-dom"

export default function ViewMemberAllocations(props) {
  const theme = useTheme();

  const { data: allocations, error, isLoading } = useGetMemberAllocationsQuery(props.membershipNumber)

  if(isLoading){
    return <Loading />
  }else if(error) {
    return <Error error={error}>Unable to load allocations</Error>
  }

  return <Table>
    <TableHead>
      <TableRow>
        <TableCell>Event</TableCell>
        <TableCell>Allocation</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {allocations.map(a => <TableRow key={a.combinedEventId} className={"allocation_"+a.allocation}>
          <TableCell><MUILink component={Link} to={"/events/"+a.combinedEventId}>{a.name}</MUILink><br /><span style={{color: theme.palette.text.secondary}}><DateWidget date={a.startDate} format="D MMMM YYYY" /></span></TableCell>
          <TableCell><AllocationWidget allocation={a.allocation} marginBottom="0rem" textOnly /></TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
}