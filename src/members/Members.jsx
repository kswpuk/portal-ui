import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { selectMembers } from "../redux/navSlice";
import ChangePhoto from "./ChangePhoto";
import Compare from "./Compare";
import EditMember from "./EditMember";
import ListMembers from "./ListMembers";
import ViewMember from "./ViewMember";
import { useEffect } from "react";

export default function Members() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectMembers())
  }, [])

  return <>
    <Routes>
      <Route path=":membershipNumber/view" element={<ViewMember />} />
      <Route path=":membershipNumber/edit" element={<EditMember />} />
      <Route path=":membershipNumber/photo" element={<ChangePhoto />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/" element={<ListMembers />} />
    </Routes>
  </>
}