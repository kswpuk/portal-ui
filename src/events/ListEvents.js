import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/navSlice'
import { Box, Fab, Grid, Tab, Tabs } from '@mui/material'

import { useEffect, useState } from 'react'
import EventCard from './EventCard'
import { useListEventsQuery } from '../redux/eventsApi'
import Loading from '../common/Loading'
import Error from '../common/Error'
import Privileged from '../common/Privileged'
import { Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export default function ListEvents() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setTitle("Events"))
  }, [dispatch])

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { data: events, error, isLoading, refetch } = useListEventsQuery(selectedTab === 1)

  if(isLoading){
    return <Loading />
  }else if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of events</Error>
  }

  return <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1rem' }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Current and Upcoming Events" />
        <Tab label="All Events" />
      </Tabs>
    </Box>

    <Grid container spacing={2}>
      {events.map(e => <Grid item key={e.combinedEventId} sm={12} md={4}>
        <EventCard event={e} />
      </Grid>
      )}
    </Grid>

    <Privileged allowed={["EVENTS"]}>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} component={Link} to='/events/new'>
        <Add />
      </Fab>
    </Privileged>
  </>
}