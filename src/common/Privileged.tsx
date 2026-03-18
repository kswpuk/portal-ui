import { fetchAuthSession } from 'aws-amplify/auth'
import { ReactElement, ReactNode, useEffect, useState } from 'react';

interface PrivilegedProps {
  allowed: string[]
  children: ReactNode
  denyMessage?: string
}

export default function Privileged(props: PrivilegedProps){
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    fetchAuthSession().then(session => {
      const username = session.tokens?.accessToken.payload["username"] as string;
      const groups = session.tokens?.accessToken.payload["cognito:groups"] as string[];

      setAllow(groups.includes("MANAGER") || groups.includes("PORTAL") || (props.allowed && (props.allowed.includes(username) || groups.filter(g => props.allowed.includes(g)).length > 0)));
    })
  }, []);

  if(allow){
    return props.children;
  }else{
    return props.denyMessage || null;
  }
}