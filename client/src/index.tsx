import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import reportWebVitals from './reportWebVitals';
import { getAccessToken, setAccessToken } from './accessToken';
import { setContext } from '@apollo/client/link/context';
import { App } from './App';
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwt_decode from 'jwt-decode';

interface MyToken {
  exp: number;
}

function isMyToken(toCheck: unknown): toCheck is MyToken {
  return toCheck instanceof Object && 'exp' in toCheck;
}

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (!token) {
      return true;
    }
    
    try {
      const decoded: unknown = jwt_decode(token);
      let exp: number = 0;
      if (isMyToken(decoded)) {
        exp = decoded.exp;
    }
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch('http://localhost:4000/refresh_token', { method: 'POST', credentials: 'include' });
  },
  handleFetch: (accessToken: string) => {
     setAccessToken(accessToken);
  },
  handleError: (err: Error) => {
    console.warn('Your refresh token is invalid. Try to relogin.');
    console.error(err);
  },
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers } ) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: refreshLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
