import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'
import { useState } from 'react';

export default function Privileged(props){
  const [allow, setAllow] = useState(false);

  fetchAuthSession().then(session => {
    const username = parseInt(session.tokens?.accessToken.payload["username"]);
    const groups = session.tokens?.accessToken.payload["cognito:groups"];

    setAllow(groups.includes("MANAGER") || (props.allowed && (props.allowed.includes(username) || groups.filter(g => props.allowed.includes(g)).length > 0)));
  })

  if(allow){
    return props.children;
  }else{
    return props.denyMessage || null;
  }
}