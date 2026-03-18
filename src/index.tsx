import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AuthApp from './AuthApp';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // default theme

import { store } from './redux/store'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material';
import { darkTheme, theme } from './theme';

//TODO: Also/alternatively make this a user preference
//const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersDarkMode = false;

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={prefersDarkMode ? darkTheme : theme}>
      <Authenticator.Provider>
        <Provider store={store}>
          <div data-theme={prefersDarkMode ? "dark" : "light"}>
            <AuthApp />
          </div>
        </Provider>
      </Authenticator.Provider>
    </ThemeProvider>
  </React.StrictMode>
);