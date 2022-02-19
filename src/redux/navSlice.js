import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  title: null,
  selected: null
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload
    },
    selectHome: (state) => {
      state.selected = HOME
    },
    selectApplications: (state) => {
      state.selected = APPLICATIONS
    },
    selectEvents: (state) => {
      state.selected = EVENTS
    },
    selectMembers: (state) => {
      state.selected = MEMBERS
    },
    selectReport: (state) => {
      state.selected = REPORT
    },
    selectShop: (state) => {
      state.selected = SHOP
    },
    selectUser: (state) => {
      state.selected = USER
    },
    selectPhoto: (state) => {
      state.selected = PHOTO
    },
    selectChangePassword: (state) => {
      state.selected = CHANGE_PASSWORD
    },
    selectNone: (state) => {
      state.selected = null
    }
  },
})

export const { setTitle, selectHome, selectApplications, selectEvents, selectMembers, selectReport, selectShop, selectUser, selectPhoto, selectChangePassword, selectNone } = navSlice.actions

export const HOME = "home"
export const APPLICATIONS = "applications"
export const EVENTS = "events"
export const MEMBERS = "members"
export const REPORT = "report"
export const SHOP = "shop"
export const USER = "user"
export const PHOTO = "photo"
export const CHANGE_PASSWORD = "change_password"

export default navSlice.reducer