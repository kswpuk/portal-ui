import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AuthApp from './AuthApp';
import reportWebVitals from './reportWebVitals';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // default theme
import { HelmetProvider } from 'react-helmet-async';

import { store } from './redux/store'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material';
import { darkTheme, theme } from './theme';

//TODO: Also/alternatively make this a user preference
//const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersDarkMode = false;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={prefersDarkMode ? darkTheme : theme}>
      <Authenticator.Provider>
        <HelmetProvider>
          <Provider store={store}>
            <div data-theme={prefersDarkMode ? "dark" : "light"}>
              <AuthApp />
            </div>
          </Provider>
        </HelmetProvider>
      </Authenticator.Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
