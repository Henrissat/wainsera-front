import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import 'react-toastify/dist/ReactToastify.css';

const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});
const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(`${localStorage.getItem("userLog")}`)?.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>a
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  // </React.StrictMode>
);

reportWebVitals();
