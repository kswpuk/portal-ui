import { Link, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { selectShop, setTitle } from '../redux/navSlice'
import { useEffect } from 'react'

export default function Shop() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTitle("Shop"))
    dispatch(selectShop())
  }, [])

  return <>
    <Typography variant='h6'>Neckers and Nametapes</Typography>
    <Typography variant='body1' gutterBottom>
      All members (including those who were previously members of the QSWP) will receive a KSWP necker and nametape at their first KSWP event.
      Additional neckers can be purchased (as replacements, or to have one for formal and one for informal events) from the KSWP Manager for £6 each (plus postage).
    </Typography>

    <Typography variant='h6'>Clothing</Typography>
    <Typography variant='body1'>
      KSWP Hoodies, T-shirts, Polo Shirts and Softshells - which are generally worn at less formal events and socials - can be purchased via the online stores below.
    </Typography>
    <ul>
      <li><Link href="https://www.carrielou.co.uk/kswp">Carrie Lou Print and Embroidery</Link></li>
      <li><Link href="https://www.polarproducts.org.uk/collections/kings-scout-working-party">Polar Products</Link> (Password: <strong>{import.meta.env.VITE_SHOP_PASSWORD}</strong>)</li>
    </ul>
    <Typography variant='body1'>
      Please be aware that when ordering clothing, you are doing so through a third party company and any issues should be addressed to, and resolved with, the company directly.
      Make sure you check the sizing information (particularly for women's fit items), and the terms and conditions when placing the order.
    </Typography>
  </>

  /*return <>
    <Typography variant='body1'>
      <strong>Please note:</strong> All members (including those who were previously members of the QSWP) will receive a KSWP necker and nametape at their first KSWP event, and that you will not be able to order additional neckers or nametapes until you have attended a KSWP event.
    </Typography>

    <Typography variant='body1'>
      The shop is currently being redeveloped, and is not available online. Please view the price list below, and contact the <Link href="mailto:manager@kswp.org.uk">KSWP Manager</Link> if you would like to place an order.
      Some stock of old QSWP nametapes and neckers may be availableon request.
    </Typography>
    <ul>
      <li><Typography variant='body1'>KSWP Necker - &pound;7.50</Typography></li>
      <li><Typography variant='body1'>KSWP Nametape (Green) - &pound;0.50</Typography></li>
      <li><Typography variant='body1'>KSWP Nametape (Blue) - &pound;0.50</Typography></li>
      <li><Typography variant='body1'>75th Anniversary Badge - &pound;1.50</Typography></li>
    </ul>
    <Typography variant='body1' gutterBottom>
      Our preferred delivery method is to give you your items at the next KSWP event that you attend.
      However, if you prefer, we can post them to you for an additional cost of &pound;2.00.
      Your items will be sent to the address we have on record for you (i.e. the address on the Portal).
      If you wish to have them sent to a different address, please let us know when placing the order.
    </Typography>
    <Typography variant='body1' gutterBottom>
      All new members will receive a necker and a nametape at the first event they attend, and do <strong>not</strong> need to order one.
    </Typography>
    <Typography variant='body1'>
      KSWP Hoodies, T-shirts and Polo Shirts - which are generally worn at less formal events and socials - can be purchased via the <Link href="https://www.carrielou.co.uk/kswp">Carrie Lou Print and Embroidery</Link> store.
    </Typography>
  </>*/
}