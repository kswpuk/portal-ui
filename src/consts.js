export const drawerWidth = 240;
export const baseUrl = "https://b4dfslkqae.execute-api.eu-west-2.amazonaws.com/portal-dev/"

export const committeeRoles = {
  "MANAGER": {
    "name": "QSWP Manager",
    "email": "manager@qswp.org.uk",
    "sortOrder": 0
  },
  "EVENTS": {
    "name": "Events Coordinator",
    "email": "events@qswp.org.uk",
    "sortOrder": 1
  },
  "MONEY": {
    "name": "Finance Coordinator",
    "email": "money@qswp.org.uk",
    "sortOrder": 2
  },
  "MEMBERS": {
    "name": "Membership Coordinator",
    "email": "members@qswp.org.uk",
    "sortOrder": 3
  },
  "MEDIA": {
    "name": "Media Coordinator",
    "email": "media@qswp.org.uk",
    "sortOrder": 4
  },
  "SOCIALS": {
    "name": "Socials Coordinator",
    "email": "socials@qswp.org.uk",
    "sortOrder": 5
  }
}

export const REGISTERED = "REGISTERED"
export const ALLOCATED = "ALLOCATED"
export const ATTENDED = "ATTENDED"
export const NOT_ALLOCATED = "NOT_ALLOCATED"
export const RESERVE = "RESERVE"
export const DROPPED_OUT = "DROPPED_OUT"
export const NO_SHOW = "NO_SHOW"

export const ALLOCATION_COLOURS = {
  REGISTERED: "#e3f2fd",
  ALLOCATED: "#f1f8e9",
  ATTENDED: "#f1f8e9",
  NOT_ALLOCATED: "#eceff1",
  RESERVE: "#fffde7",
  DROPPED_OUT: "#ffebee",
  NO_SHOW: "#ffebee"
}