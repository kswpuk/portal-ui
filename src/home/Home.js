import { Grid, Stack, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { selectHome, setTitle } from '../redux/navSlice'
import HomeEvents from './HomeEvents'
import HomeMembership from './HomeMembership'
import HomeOtherEmails from './HomeOtherEmails'
import HomeOtherSocialMedia from './HomeOtherSocialMedia'
import { grey } from '@mui/material/colors';

export default function Home() {
  const dispatch = useDispatch()

  dispatch(setTitle(null))
  dispatch(selectHome())

  return <>
    <Grid container spacing={3}>
      <Grid item lg={4} md={6} sm={12}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Your Membership</Typography>
          <HomeMembership />
        </Stack>
      </Grid>

      <Grid item lg={4} md={6} sm={12}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Events</Typography>
          <HomeEvents />
        </Stack>
      </Grid>

      <Grid item lg={4} md={6} sm={12}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Other</Typography>
          <HomeOtherSocialMedia />
          <HomeOtherEmails />
        </Stack>
      </Grid>
    </Grid>
  </>
}