import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setTitle } from '../redux/navSlice'

export default function ChangePhoto() {
  const dispatch = useDispatch()
  const { membershipNumber } = useParams()

  useEffect(() => {
    dispatch(setTitle("Updating photo for "+membershipNumber))
  }, [dispatch, membershipNumber])

  return <>
    <p>Coming soon...</p>
  </>
}