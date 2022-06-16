import { Link, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { selectShop, setTitle } from '../redux/navSlice'

export default function Shop() {
  const dispatch = useDispatch()

  dispatch(setTitle("Shop"))
  dispatch(selectShop())

  return <>
    <Typography variant='body1'>
      The shop is currently being redeveloped, and is not available online.
      If you wish to order additional neckers or nametapes, please review the price list below and e-mail the <Link href="mailto:manager@qswp.org.uk">QSWP Manager</Link> with your order.
      Bank transfer of the full amount will be required prior to any items being sent.
    </Typography>
    <ul>
      <li><Typography variant='body1'>QSWP Necker - &pound;7.50</Typography></li>
      <li><Typography variant='body1'>QSWP Nametape (Green) - &pound;0.50</Typography></li>
      <li><Typography variant='body1'>QSWP Nametape (Blue) - &pound;0.50</Typography></li>
      <li><Typography variant='body1'>75th Anniversary Badge - &pound;2.50</Typography></li>
    </ul>
    <Typography variant='body1' gutterBottom>
      Our preferred delivery method is to give you your items at the next QSWP event that you attend.
      However, if you prefer, we can post them to you for an additional cost of &pound;2.00.
      Your items will be sent to the address we have on record for you (i.e. the address on the Portal).
      If you wish to have them sent to a different address, please let us know when placing the order.
    </Typography>
    <Typography variant='body1' gutterBottom>
      All new members will receive a necker and a nametape at the first event they attend, and do <strong>not</strong> need to order one.
    </Typography>
    <Typography variant='body1'>
      QSWP Hoodies, T-shirts and Polo Shirts - which are generally worn at less formal events and socials - can be purchased via the <Link href="https://www.carrielou.co.uk/qswp">Carrie Lou Print and Embroidery</Link> store.
    </Typography>
  </>
}