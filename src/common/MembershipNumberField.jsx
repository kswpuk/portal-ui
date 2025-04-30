import { Autocomplete, Box, createFilterOptions, TextField } from "@mui/material";
import { useListMembersQuery } from '../redux/membersApi'

export default function MembershipNumberField(props){
  // TODO: Load on open, not by default
  const { data: members, isLoading } = useListMembersQuery()

  const memberToString = (member) => `${member.membershipNumber} (${member.firstName} ${member.surname})`

  const filterOptions = createFilterOptions({
    stringify: (option) => memberToString(option),
  });

  return <Autocomplete
    disablePortal freeSolo loading={isLoading}
    options={members || []} getOptionLabel={o => o.membershipNumber} isOptionEqualToValue={(o1, o2) => o1.membershipNumber == o2.membershipNumber}
    filterOptions={filterOptions}
    renderOption={(props, option) => {
      const { key, ...optionProps } = props;
      return (
        <Box
          key={key}
          component="li"
          {...optionProps}
        >
          {memberToString(option)}
        </Box>
      );
    }}
    renderInput={(params) => <TextField 
      {...props.register}
      {...params}

      error={props.error != null} helperText={props.error ? "This field is required" : null}
      required fullWidth
      variant="outlined" label="Scout Membership Number" />}
  />
}