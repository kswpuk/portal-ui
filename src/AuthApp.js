import { Amplify } from 'aws-amplify';

import { Authenticator, Image, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthApp.css'

import awsConfig from './awsConfig';
import App from './App';
Amplify.configure(awsConfig);

export default function AuthApp() {
  const components = {
    Header() {
      return <View textAlign="center" style={{margin: '2rem'}}>
        <Image
          alt="QSWP Crown Logo"
          src="/logo192.png"
        />
      </View>
    }
  }
  return (
    <Authenticator components={components}>
      {({ signOut, user }) => <App user={user} signOut={signOut} />}
    </Authenticator>
  );
}