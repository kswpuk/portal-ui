import { Autocomplete, Box, createFilterOptions, TextField } from "@mui/material";
import { useListMembersQuery } from '../redux/membersApi'
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface MembershipNumberFieldProps {
  error?: FieldError
  register: UseFormRegisterReturn
}

export default function MembershipNumberField(props: MembershipNumberFieldProps){
  // TODO: Load on open, not by default
  const { data: members, isLoading } = useListMembersQuery()

  const memberToString = (member: MemberListItem) => `${member.membershipNumber} (${member.firstName} ${member.surname})`

  const filterOptions = createFilterOptions<MemberListItem>({
    stringify: (option) => memberToString(option),
  });

  return <Autocomplete
    disablePortal freeSolo loading={isLoading}
    options={members?.toSorted((m1, m2) => m1.surname.localeCompare(m2.surname) || m1.firstName.localeCompare(m2.firstName)) || []} getOptionLabel={o => typeof o === "string" ? o : o.membershipNumber} isOptionEqualToValue={(o1, o2) => o1.membershipNumber == o2.membershipNumber}
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