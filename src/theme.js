import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#a60c2b',
    },
    secondary: {
      main: '#fdce72',
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a60c2b',
    },
    secondary: {
      main: '#fdce72',
    },
  },
})