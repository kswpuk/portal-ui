import { useDispatch } from 'react-redux'
import { selectShop, setTitle } from '../redux/navSlice'

export default function Shop() {
  const dispatch = useDispatch()

  dispatch(setTitle("Shop"))
  dispatch(selectShop())

  return <p>Shop</p>
}