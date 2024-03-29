import { Amplify } from 'aws-amplify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Authenticator, Image, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsConfig from './awsConfig';
import { lazy, Suspense } from 'react';
import Loading from './common/Loading';

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

  const LoadingSuspense = (props) => {
    return <Suspense fallback={<Loading />}> 
      {props.children}
    </Suspense>
  }

  const LazyJoin = lazy(() => import('./join/Join'));
  const LazyApp = lazy(() => import('./App'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/join/*" element={<LoadingSuspense><LazyJoin /></LoadingSuspense>} />
        <Route path="/*" element={<Authenticator components={components} hideSignUp={true}>
            {({ signOut, user }) => <LoadingSuspense><LazyApp user={user} signOut={signOut} /></LoadingSuspense>}
          </Authenticator>
        } />
      </Routes>
    </BrowserRouter>
  );
}