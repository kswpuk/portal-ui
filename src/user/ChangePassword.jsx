import { useDispatch } from 'react-redux'
import { selectChangePassword, setTitle } from '../redux/navSlice'
import { Box, IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Error from '../common/Error';
import Success from '../common/Success';
import { getCurrentUser, updatePassword } from 'aws-amplify/auth'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SubmitButton from '../common/SubmitButton';

export default function ChangePassword() {
  const dispatch = useDispatch()

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    dispatch(setTitle("Change Password"))
    dispatch(selectChangePassword())
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [membershipNumber, setMembershipNumber] = useState("");
  getCurrentUser().then(user => setMembershipNumber(user.username));

  const changePassword = data => {
    setSuccess(false)
    setLoading(true)
    setError(null)

    updatePassword( {oldPassword: data.currentPassword, newPassword: data.newPassword} )
    .then(() => {
      setSuccess(true)
      setLoading(false)
      reset()
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    });
  }

  return <>
    <form onSubmit={handleSubmit(changePassword)}>
      <Stack spacing={3}>
        { success ? <Success>Your password has been successfully changed</Success> : null }
        { error ? <Error error={error}>There was an issue changing your password, and your password has not been changed.</Error> : null }

        <TextField label="Username" autoComplete="username" style={{display: 'none'}} value={membershipNumber}/>

        <Typography variant="h5">Your Current Password</Typography>
        <Typography paragraph>For security, please enter your current password so we can confirm it's you!</Typography>

        <TextField variant="outlined" label="Current Password" type="password" autoComplete="current-password" error={errors.currentPassword != null} {...register("currentPassword", {required: true})} autoFocus />

        <Typography variant="h5">Your New Password</Typography>
        <Typography paragraph>
          A sensible way of coming up with a secure but memorable password, is to use <Link href="https://www.ncsc.gov.uk/blog-post/three-random-words-or-thinkrandom-0" target="_blank" rel="noreferrer">Three Random Words</Link>.
          This gives you a long password which is hard to guess, but is easy to remember as you only have to remember three words rather than a long string of characters.
          You can also add in numbers and symbols to make the password even more secure, for example <em>3RedHouseMonkeys27!</em>
        </Typography>
        <TextField 
        variant="outlined" label="New Password" type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          error={errors.newPassword != null}
          helperText="Your password must be at least 8 characters long, and contain upper and lower case letters"
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }} {...register("newPassword", {required: true, minLength: 8})} />

        <Box>
          <SubmitButton submitting={loading}>Change Password</SubmitButton>
        </Box>
      </Stack>
      
    </form>
  </>
}
