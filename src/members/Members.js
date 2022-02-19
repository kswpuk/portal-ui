import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { selectMembers } from "../redux/navSlice";
import ChangePhoto from "./ChangePhoto";
import EditMember from "./EditMember";
import ListMembers from "./ListMembers";
import ViewMember from "./ViewMember";

export default function Members() {
  const dispatch = useDispatch()
  dispatch(selectMembers())

  return <>
    <Routes>
      <Route path=":membershipNumber/view" element={<ViewMember />} />
      <Route path=":membershipNumber/edit" element={<EditMember />} />
      <Route path=":membershipNumber/photo" element={<ChangePhoto />} />
      <Route path="/" element={<ListMembers />} />
    </Routes>
  </>
}