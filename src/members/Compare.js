import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from "react-hook-form";

import SubmitButton from '../common/SubmitButton'

import { setTitle } from '../redux/navSlice'
import { useCompareQuery } from '../redux/membersApi';
import Error from '../common/Error';
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { PersonAdd, PersonRemove } from '@mui/icons-material';

export default function Compare() {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [membershipNumbers, setMembershipNumbers] = useState([])

  const { data, error, isFetching } = useCompareQuery(membershipNumbers , {skip: membershipNumbers.length === 0})


  useEffect(() => {
    dispatch(setTitle("Compare Membership Lists"))
  }, [dispatch])

  const onSubmit = (data) => {
    setMembershipNumbers(data.membershipNumbers.split(/\n+/).map(n => parseInt(n.trim())).filter(n => n))
  }

  if(error){
    return <Error error={error}>An error occurred whilst comparing membership lists</Error>
  }

  if(data && !isFetching && membershipNumbers.length > 0) {
    const Grey = (props) => <Box sx={{color: grey[500]}}><em>{props.children}</em></Box>

    return <>
      <Typography variant='body1' gutterBottom>
        The actions required to make the external list (Compass) match the Portal are detailed below.
      </Typography>

      <DataGrid autoHeight checkboxSelection={true} sx={{marginTop: '1rem'}} initialState={{
        pagination: {
          pageSize: 25,
        },
        filter: {
          filterModel: {
            items: [{ columnField: "action", operatorValue: "contains", "value": "Compass"}]
          }
        },
        sorting: {
          sortModel: [{ field: "membershipNumber", sort: "asc"}]
        }
      }} columns={[
          {field: "membershipNumber", headerName: "Membership Number", flex: 1, hideable: false},
          {field: "name", headerName: "Name", flex: 2, hideable: false, renderCell: params => params.row.name || <Grey>Unknown</Grey>},
          {field: "action", headerName: "Action", flex: 2, hideable: false, renderCell: params => {
            switch(params.row.action){
              case "ADD_TO_COMPASS":
                return <><PersonAdd sx={{marginRight: '1rem'}} />Add to Compass</>
              case "NONE":
                return <Grey>No action required</Grey>
              case "REMOVE_FROM_COMPASS":
                return <><PersonRemove sx={{marginRight: '1rem'}} />Remove from Compass</>
              default:
                return params.row.action 
            }
          }}
        ]} rows={data}
        getRowId={(row) => row.membershipNumber} />

        <Button sx={{marginTop: '1rem'}} onClick={() => {
          setMembershipNumbers([]);
          
        }}>Start again</Button>
    </>
  }
  
  return <>
    <Typography variant='body1' gutterBottom>
      You can compare an external list of membership numbers (e.g. exported from Compass) with the current state as recorded on the Portal using the tool below.
    </Typography>

    <form onSubmit={handleSubmit(onSubmit)}>        
      <TextField variant="outlined" label="Membership Numbers"
        error={errors.membershipNumbers != null} helperText={errors.membershipNumbers ? "This field is required, one membership number per line" : "Enter one membership number per line"}
        required multiline minRows={10} fullWidth
        sx={{marginBottom: '1rem', marginTop: '1rem'}}
        {...register("membershipNumbers", {required: true, pattern: /^([0-9]+(\r?\n)?)+$/})} />
      
      <SubmitButton disabled={false} submitting={isFetching}>Compare Lists</SubmitButton>
    </form>
  </>
}