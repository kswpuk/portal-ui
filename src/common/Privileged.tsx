import { fetchAuthSession } from 'aws-amplify/auth'
import { ReactElement, ReactNode, useEffect, useState } from 'react';

interface PrivilegedProps {
  /**
   * Cognito usernames or group names that may view the content.
   * The `MANAGER` and `PORTAL` groups are always permitted regardless of this list.
   */
  allowed: string[]
  /** Content rendered for authorised users. */
  children: ReactNode
  /** Message rendered for unauthorised users. Renders nothing if omitted. */
  denyMessage?: string
}

/**
 * Conditionally renders children based on the current user's Cognito groups or username.
 *
 * Users in the `MANAGER` or `PORTAL` groups always have access. Access can also
 * be granted to specific usernames or additional group names via `allowed`.
 * Renders `denyMessage` (or nothing) for all other users.
 */
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