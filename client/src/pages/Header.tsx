import React from 'react'
import { Link } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, {client}] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>You are logged in as: {data.me.email}</div>;
  } else {
    body = <div>Not logged in</div>;
  }

  return (<header>
    <div>
      <Link to="/">Home</Link>
    </div>
    <div>
      <Link to="/register">Register</Link>
    </div>
    <div>
      <Link to="/login">Login</Link>
    </div>
    <div>
      <Link to="/bye">Bye</Link>
    </div>
    <div>
      {!loading && data && data.me &&
      <button type="button" onClick={async () => {
        await logout();
        setAccessToken('');
        await client!.resetStore();
      }}>logout</button>}
    </div>
    {body}
    </header>);
}