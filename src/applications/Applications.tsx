import { Route, Routes } from 'react-router-dom'
import { selectApplications } from '../redux/navSlice'
import ListApplications from './ListApplications'
import ViewApplication from './ViewApplication'
import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'

export default function Applications() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(selectApplications())
  }, [])

  return <>
    <Routes>
      <Route path=":membershipNumber/view" element={<ViewApplication />} />
      <Route path="/" element={<ListApplications />} />
    </Routes>
  </>
}