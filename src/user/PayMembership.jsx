import { Box, Typography } from '@mui/material'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Error from '../common/Error'
import Loading from '../common/Loading'
import SubmitButton from '../common/SubmitButton'
import { useGetMemberQuery, usePayMembershipMutation } from '../redux/membersApi'
import { selectPayMembership, setTitle } from '../redux/navSlice'

export default function PayMembership() {
  const dispatch = useDispatch()

  dispatch(setTitle("Pay Membership"))
  dispatch(selectPayMembership())

  const [membershipNumber, setMembershipNumber] = useState(null);
  Auth.currentUserInfo().then(user => setMembershipNumber(user.username));

  const { data: member, error, isLoading, refetch } = useGetMemberQuery(membershipNumber, {skip: membershipNumber === null})
  const [ payMembership, { data: payData, isLoading: isPayLoading, isSuccess: isPaySuccess } ] = usePayMembershipMutation()

  if(isPaySuccess){
    window.location = payData.url
  }

  if (membershipNumber === null || isLoading){
    return <Loading />
  }else if(error) {
    return <Error error={error} onRetry={refetch}>Unable to get your details</Error>
  }else{
    const expiryDate = new Date(member.membershipExpires || 0);
    const prePaymentDate = new Date(expiryDate.getTime() - 30*24*60*60*1000);
    const prePaymentDateIso = prePaymentDate.toISOString().slice(0, 10)

    const now = new Date()

    let expiryDateEl = "Unknown"
    if(member.membershipExpires){
      expiryDateEl = <strong><time dateTime={member.membershipExpires}>{member.membershipExpires}</time></strong>
    }

    let text = null
    let showPay = true
    if(member.status === "ACTIVE" && now < prePaymentDate){
      showPay = false
      text = <>
        <Typography variant="body1">Thank you, you're already up to date with your membership payment for this year.</Typography>
        <Typography variant="body1">
          Your current membership will expire on {expiryDateEl}.
          You will be able to renew your membership up to 30 days before it expires, on <time dateTime={prePaymentDateIso}>{prePaymentDateIso}</time>.
        </Typography>
      </>
    }else if(member.status === "ACTIVE"){
      text = <>
        <Typography variant="body1">Your membership will expire on {expiryDateEl}.</Typography>
        <Typography variant="body1">
          You can choose to pay your membership fee of &pound;5.00 now, or wait until it expires.
          Paying your membership now will extend your current expiry date by 1 year, so you will not lose out by paying early.
        </Typography>

      </>
    }else{
      text = <>
        <Typography variant="body1">
          Your membership expired on {expiryDateEl}, and payment of &pound;5.00 is now due.
          You will not be eligible to register for or attend any KSWP events until membership has been paid.
        </Typography>
      </>
    }

    return <>
      <Box sx={{mb: '1rem'}}>{text}</Box>
      {showPay ? <SubmitButton size='large' submitting={isPayLoading} onClick={() => payMembership(membershipNumber)} submittingText="Redirecting...">Pay Now</SubmitButton> : null}
    </>
  }
}