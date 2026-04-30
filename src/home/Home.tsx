import { Grid, Stack, Typography } from '@mui/material'
import { selectHome, setTitle } from '../redux/navSlice'
import HomeEvents from './HomeEvents'
import HomeMembership from './HomeMembership'
import HomeOtherEmails from './HomeOtherEmails'
import HomeOtherSocialMedia from './HomeOtherSocialMedia'
import { grey } from '@mui/material/colors';
import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'

export default function Home() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setTitle(null))
    dispatch(selectHome())
  }, [])

  return <>
    <Grid container spacing={3}>
      <Grid size={{xs: 12, md: 6, lg: 4}}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Your Membership</Typography>
          <HomeMembership />
        </Stack>
      </Grid>

      <Grid size={{xs: 12, md: 6, lg: 4}}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Events</Typography>
          <HomeEvents />
        </Stack>
      </Grid>

      <Grid size={{xs: 12, md: 6, lg: 4}}>
        <Stack spacing={2}>
          <Typography variant="h5" color={grey[400]}>Other</Typography>
          <HomeOtherSocialMedia />
          <HomeOtherEmails />
        </Stack>
      </Grid>
    </Grid>
  </>
}