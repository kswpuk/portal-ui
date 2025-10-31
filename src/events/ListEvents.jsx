import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/navSlice'
import { Box, FormControlLabel, Grid, Link as MUILink, SpeedDial, SpeedDialAction, SpeedDialIcon, Switch, Tab, Tabs } from '@mui/material'

import { useEffect, useState } from 'react'
import EventCard from './EventCard'
import { useListEventsQuery } from '../redux/eventsApi'
import Loading from '../common/Loading'
import Error from '../common/Error'
import Privileged from '../common/Privileged'
import { Add, Close, EventRepeat, MoreHoriz } from '@mui/icons-material'
import { Link } from 'react-router-dom'

import moment from "moment"

export default function ListEvents() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(setTitle("Events"))
  }, [dispatch])

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [hideSocials, setHideSocials] = useState(false);
  const [hideClosed, setHideClosed] = useState(false);

  const { data: events, error, isFetching, refetch } = useListEventsQuery(selectedTab === 1)
  const now = new moment()

  if(error){
    return <Error error={error} onRetry={() => refetch()}>An error occurred whilst loading the list of events</Error>
  }

  let gridContent = null;
  if(isFetching){
    gridContent = <Loading />
  }else{
    gridContent = <Grid container spacing={2}>
      {events.filter(e => (!hideSocials || e.type !== "social") && (!hideClosed || e.allocation != null || new moment(e.registrationDate).isAfter(now, 'day'))).map(e => <Grid item key={e.combinedEventId} sm={12} md={6} lg={4}>
        <EventCard event={e} />
      </Grid>
      )}
    </Grid>
  }

  return <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1rem' }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Current and Upcoming Events" />
        <Tab label="All Events" />
      </Tabs>
    </Box>

    <FormControlLabel sx={{marginBottom: '1rem', marginRight: '3rem'}} control={ <Switch checked={hideSocials} onChange={() => setHideSocials(!hideSocials)} /> } label="Hide Socials" />
    <FormControlLabel sx={{marginBottom: '1rem'}} control={ <Switch checked={hideClosed} onChange={() => setHideClosed(!hideClosed)} /> } label="Hide Closed" />

    {gridContent}

    <Privileged allowed={["EVENTS", "SOCIALS"]}>
      <SpeedDial
        ariaLabel="Event Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<MoreHoriz />} openIcon={<Close />} />}
      >
        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/events/new"}><Add /></MUILink>}
          tooltipTitle="New"
          tooltipOpen
        />

        <SpeedDialAction
          icon={<MUILink sx={{display: "flex"}} component={Link} to={"/events/series"}><EventRepeat /></MUILink>}
          tooltipTitle="Series"
          tooltipOpen
        />
      </SpeedDial>
    </Privileged>
  </>
}