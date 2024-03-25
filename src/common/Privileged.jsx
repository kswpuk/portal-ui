import { Auth } from 'aws-amplify';
import { useState } from 'react';

export default function Privileged(props){
  const [allow, setAllow] = useState(false);

  Auth.currentAuthenticatedUser().then(user => {
    const username = parseInt(user.username);
    const groups = user.signInUserSession.accessToken.payload["cognito:groups"];

    setAllow(groups.includes("MANAGER") || (props.allowed && (props.allowed.includes(username) || groups.filter(g => props.allowed.includes(g)).length > 0)));
  })

  if(allow){
    return props.children;
  }else{
    return props.denyMessage || null;
  }
}