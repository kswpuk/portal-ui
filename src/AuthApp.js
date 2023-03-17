import { Amplify } from 'aws-amplify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Authenticator, Image, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthApp.css'

import awsConfig from './awsConfig';
import App from './App';
import Join from './join/Join';
Amplify.configure(awsConfig);

export default function AuthApp() {
  const components = {
    Header() {
      return <View textAlign="center" style={{margin: '2rem'}}>
        <Image
          alt="KSWP Crown Logo"
          src="/logo192.png"
        />
      </View>
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join/*" element={<Join />} />
        <Route path="/*" element={<Authenticator components={components}>
            {({ signOut, user }) => <App user={user} signOut={signOut} />}
          </Authenticator>
        } />
      </Routes>
    </BrowserRouter>
  );
}